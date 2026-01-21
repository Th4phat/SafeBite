import { ai } from "@/api/genAi";
import AnalysisResultScreen from "@/components/Analysis";
import { AnalysisResponse, FoodItem } from "@/constants/Struct";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Type } from "@google/genai"; // Import Schema for schema definition
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View
} from "react-native";
import { PhotoAnalysisResult, saveAnalysisResult } from '../../api/historyStorage';

import i18n from "@/languages/i18n";
import { Buffer } from 'buffer/';
import { LinearGradient } from "expo-linear-gradient";
const { width, height } = Dimensions.get("window");

type Status = "ready" | "uploading" | "results";

const MenuScannerScreen: FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [status, setStatus] = useState<Status>("ready");
  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResponse | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const [cameraKey, setCameraKey] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const scanLineAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [status, fadeAnimation]);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      setAnalysisResult(null);
      setStatus("ready");
      setCameraKey((prevKey) => prevKey + 1);
      setIsCameraActive(false);

      scanLineAnimation.setValue(0);
      pulseAnimation.setValue(1);
      fadeAnimation.setValue(0);

      const scanAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnimation, {
            toValue: 0,
            duration: 0, // Instant reset to top
            useNativeDriver: true,
          }),
        ])
      );
      scanAnimation.start();

      const pulseAnimationLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimationLoop.start();

      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      return () => {
        setIsFocused(false);
        scanAnimation.stop();
        pulseAnimationLoop.stop();
        scanLineAnimation.setValue(0);
        pulseAnimation.setValue(1);
        fadeAnimation.setValue(0);
      };
    }, [scanLineAnimation, pulseAnimation, fadeAnimation])
  );


  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.permissionContainer}
      >
        <View style={styles.permissionCard}>
          <Ionicons name="camera-outline" size={80} color="#667eea" />
          <Text style={styles.permissionTitle}>{i18n.t("camera.permissionTitle")}</Text>
          <Text style={styles.permissionText}>
            {i18n.t("camera.permissionText")}
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              style={styles.permissionButtonGradient}
            >
              <Text style={styles.permissionButtonText}>{i18n.t("camera.permissionButton")}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  const handleTakePicture = async (): Promise<void> => {
    if (cameraRef.current && status === "ready" && isCameraActive) {
      setStatus("uploading");
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (!photo?.uri) {
          console.log("Photo URI is null or undefined.");
          throw new Error("Photo URI is null or undefined.");
        }
        console.log("Photo URI:", photo.uri);

        const base64Photo = await fetch(photo.uri).then((response) =>
          response.arrayBuffer()
        ).then((buffer) => Buffer.from(buffer).toString("base64"));

        const prompt = `
        Act as an expert nutritionist and food safety analyst. Analyze the provided image to identify all distinct food items.

For each item, present the data in a structured Markdown table with the following columns:

1.  **Food Item:** Name in English followed by the native name in parentheses, e.g., "Omelet (ไข่เจียว)".
2.  **Potential Allergens:** List common allergens visible or typically associated with this dish. Format as: "English Name (Thai Name)".
3.  **Main Ingredients:** List the primary visible and standard ingredients. Format as: "English Name (Thai Name)".

**Important Guidelines:**
* If you are unsure about a specific ingredient, note it as "Unverified".
* Include common hidden allergens typical for Thai cuisine (e.g., fish sauce, shrimp paste) if the dish usually contains them.
* Ensure all Thai translations are accurate and colloquial.
        `;

        const models = ["gemini-3-flash-preview", 'gemini-2.5-flash', 'gemini-2.5-flash-lite-preview-09-2025'];
        let result = null;
        let lastError = null;

        for (const modelId of models) {
          try {
            console.log(`Attempting analysis with model: ${modelId}`);
            const response = await ai.generateContent({
              model: modelId,
              contents: [
                { text: prompt },
                {
                  inlineData: {
                    data: base64Photo,
                    mimeType: "image/jpeg",
                  },
                },
              ],
              config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: {
                        type: Type.STRING,
                      },
                      allergens: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.STRING,
                        },
                      },
                      ingredients: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.STRING,
                        },
                      },
                    },
                    propertyOrdering: ["name", "allergens", "ingredients"],
                  },
                },
              },
            });
            result = response;
            break; // Exit loop on success
          } catch (error) {
            console.error(`Analysis failed with model ${modelId}:`, error);
            lastError = error;
          }
        }

        if (!result) {
          throw lastError || new Error("All models failed to analyze the image.");
        }

        const parsedResult: FoodItem[] = JSON.parse(result.text || "[]");

        // Load user profile for allergen matching
        const PROFILE_STORAGE_KEY = "userAllergyProfile";
        const jsonValue = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        let userAllergens: string[] = [];
        if (jsonValue) {
          const profile = JSON.parse(jsonValue);
          userAllergens = profile.allergens
            .filter((a: any) => a.isSelected)
            .map((a: any) => a.name.toLowerCase());
        }

        let matchFound = false;
        const transformedResult: AnalysisResponse = {
          foods: parsedResult.map((item, index) => {
            const isDangerous = item.allergens.some(a =>
              userAllergens.some(userA => a.toLowerCase().includes(userA))
            ) || item.ingredients.some(ing =>
              userAllergens.some(userA => ing.toLowerCase().includes(userA))
            );

            if (isDangerous) matchFound = true;

            return {
              id: `${Date.now()}-${index}`,
              name: item.name,
              allergens: item.allergens,
              ingredients: item.ingredients,
              isDangerous: isDangerous,
            };
          }),
        };

        if (matchFound) {
          Vibration.vibrate([0, 500, 200, 500]); // Pattern for warning
          Alert.alert(
            i18n.t("analysis.warningTitle") || "Allergen Warning!",
            i18n.t("analysis.warningMessage") || "We detected ingredients that may match your allergy profile. Please be careful!",
            [{ text: "OK" }]
          );
        }

        setAnalysisResult(transformedResult);

        const newHistoryEntry: PhotoAnalysisResult = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          imageUrl: photo.uri,
          analysisData: transformedResult,
        };
        await saveAnalysisResult(newHistoryEntry);

        setStatus("results");
      } catch (error) {
        console.error("Error taking picture or analyzing:", error);
        alert("Sorry, something went wrong. Please try again.");
        setStatus("ready");
      }
    }
  };

  const handleRetake = (): void => {
    setAnalysisResult(null);
    setStatus("ready");
  };

  if (status === "results" && analysisResult) {
    return (
      <AnalysisResultScreen data={analysisResult} onRetake={handleRetake} />
    );
  }

  const scanLineTranslateY = scanLineAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height * 0.6],
  });

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView
          key={cameraKey}
          style={styles.camera}
          facing={"back"}
          ref={cameraRef}
          onCameraReady={() => setIsCameraActive(true)}
        />
      )}

      {/* Modern Overlay */}
      <Animated.View style={[styles.overlay, { opacity: fadeAnimation }]}>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructions}>
            {i18n.t("camera.cameraPosition")}
          </Text>
        </View>

        {/* Modern Viewfinder */}
        <View style={styles.viewfinderContainer}>
          <View style={styles.viewfinder}>
            {/* Animated Corner Brackets */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            {/* Animated Scan Line */}
            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [{ translateY: scanLineTranslateY }],
                },
              ]}
            />

            {/* Center Target */}
            <View style={styles.centerTarget}>
              <View style={styles.targetRing} />
              <View style={styles.targetDot} />
            </View>
          </View>
        </View>

        {/* Modern Footer */}
        <View style={styles.footer}>
          <Animated.View
            style={[
              styles.captureContainer,
              { transform: [{ scale: pulseAnimation }] },
            ]}
          >
            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleTakePicture}
              disabled={status !== "ready"}
            >
              <LinearGradient
                colors={["#ff6b6b", "#ee5a52"]}
                style={styles.captureButtonGradient}
              >
                <Ionicons name="scan" size={32} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>

      {/* Modern Loading Overlay */}
      {status === "uploading" && (
        <View style={styles.loadingOverlay}>
          <LinearGradient
            colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0.9)"]}
            style={styles.loadingGradient}
          >
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color="#667eea" />
              <Text style={styles.loadingTitle}>{i18n.t('camera.analyzingMenu')}</Text>
              <Text style={styles.loadingSubtext}>
                {i18n.t('camera.detectingIngredients')}
              </Text>
            </View>
          </LinearGradient>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 60,
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    marginTop: 60,
    marginHorizontal: 20,
  },
  headerGlass: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
  },
  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtext: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
  viewfinderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  viewfinder: {
    width: width * 0.8,
    height: height * 0.6,
    position: "relative",
    overflow: "hidden",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#667eea",
    borderWidth: 4,
    borderRadius: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#667eea",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  centerTarget: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 60,
    height: 60,
    marginLeft: -30,
    marginTop: -30,
    alignItems: "center",
    justifyContent: "center",
  },
  targetRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    borderStyle: "dashed",
  },
  targetDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#667eea",
  },
  footer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 50,
  },
  instructionsContainer: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  instructions: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  captureContainer: {
    shadowColor: "#ff6b6b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  captureButtonGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(10px)",
  },
  loadingTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
  },
  loadingSubtext: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  permissionText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  permissionButton: {
    padding: 2,
    borderRadius: 15,
    overflow: "hidden",
  },
  permissionButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  permissionButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default MenuScannerScreen;