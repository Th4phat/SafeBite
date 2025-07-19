// src/components/AnalysisResultScreen.tsx

import i18n from "@/languages/i18n";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC, useEffect, useRef } from "react";
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { AnalysisResponse } from "../api/mockApi";
import { FoodItemCard } from "../components/FoodItemCard";

// Props for the main AnalysisResultScreen component
interface AnalysisResultScreenProps {
  data: AnalysisResponse;
  onRetake: () => void;
}

const AnalysisResultScreen: FC<AnalysisResultScreenProps> = ({
  data,
  onRetake,
}) => {
  const headerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [headerAnimation]);

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.headerContainer,
            {
              opacity: headerAnimation,
              transform: [
                {
                  translateY: headerAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.header}>{i18n.t('analysis.analysisComplete')}</Text>
          <Text style={styles.subheader}>
            {i18n.t('analysis.foundItems', { count: data.foods.length, s: data.foods.length > 1 ? "s" : "" })}
          </Text>
        </Animated.View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {data.foods.map((item, index) => (
            <FoodItemCard key={item.id} item={item} index={index} />
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.retakeButton} onPress={onRetake}>
            <LinearGradient
              colors={["#FF6B6B", "#EE5A52"]}
              style={styles.retakeButtonGradient}
            >
              <Ionicons name="camera-outline" size={24} color="white" />
              <Text style={styles.retakeButtonText}>{i18n.t('analysis.scanAnotherMenu')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subheader: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
  },
  retakeButton: {
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  retakeButtonGradient: {
    flexDirection: "row",
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  retakeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },
});

export default AnalysisResultScreen;