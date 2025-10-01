
import i18n from "@/languages/i18n";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import React, { FC, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");

interface HomeScreenProps {
  onGetStarted: () => void;
}

const HomeScreen: FC<HomeScreenProps> = ({ onGetStarted }) => {
  const bounceAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [bounceAnimation, fadeAnimation]);

  const bounceTransform = bounceAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const FeatureCard: FC<{
    icon: string;
    title: string;
    description: string;
    color: string;
    delay: number;
  }> = ({ icon, title, description, color, delay }) => {
    const cardAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      setTimeout(() => {
        Animated.timing(cardAnimation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, delay);
    }, [cardAnimation, delay]);

    return (
      <Animated.View
        style={[
          styles.featureCard,
          {
            opacity: cardAnimation,
            transform: [
              {
                translateY: cardAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.featureIcon, { backgroundColor: color }]}>
          <Ionicons name={icon as any} size={32} color="white" />
        </View>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </Animated.View>
    );
  };

  const StepCard: FC<{
    step: number;
    icon: string;
    title: string;
    description: string;
    color: string;
    delay: number;
  }> = ({ step, icon, title, description, color, delay }) => {
    const stepAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      setTimeout(() => {
        Animated.timing(stepAnimation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, delay);
    }, [stepAnimation, delay]);

    return (
      <Animated.View
        style={[
          styles.stepCard,
          {
            opacity: stepAnimation,
            transform: [
              {
                translateX: stepAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [step % 2 === 0 ? -50 : 50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.stepNumber, { backgroundColor: color }]}>
          <Text style={styles.stepNumberText}>{step}</Text>
        </View>
        <View style={styles.stepContent}>
          <View style={[styles.stepIcon, { backgroundColor: `${color}20` }]}>
            <Ionicons name={icon as any} size={24} color={color} />
          </View>
          <Text style={styles.stepTitle}>{title}</Text>
          <Text style={styles.stepDescription}>{description}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[styles.header, { opacity: fadeAnimation }]}
        >
          <Animated.View
            style={[
              styles.mainIconContainer,
              { transform: [{ translateY: bounceTransform }] },
            ]}
          >
            <View style={styles.mainIcon}>
              <Text style={styles.mainIconText}>🍽️</Text>
            </View>
          </Animated.View>
          <Text style={styles.appTitle}>{i18n.t('home.appTitle')}</Text>
          <Text style={styles.appSubtitle}>
            {i18n.t('home.appSubtitle')}
          </Text>
          <Text style={styles.appDescription}>
            {i18n.t('home.appDescription')}
          </Text>
        </Animated.View>

        <Link href="/history" asChild>
          <TouchableOpacity style={styles.historyButton}>
            <Text style={styles.historyButtonText}>
              {i18n.t('home.viewPhotoHistory')}
            </Text>
          </TouchableOpacity>
        </Link>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{i18n.t('home.whyChooseTitle')}</Text>
          <View style={styles.featuresGrid}>
            <FeatureCard
              icon="scan"
              title={i18n.t('home.featureSmartScanningTitle')}
              description={i18n.t('home.featureSmartScanningDescription')}
              color="#667eea"
              delay={200}
            />
            <FeatureCard
              icon="shield-checkmark"
              title={i18n.t('home.featureSafetyFirstTitle')}
              description={i18n.t('home.featureSafetyFirstDescription')}
              color="#ff6b6b"
              delay={400}
            />
            <FeatureCard
              icon="flash"
              title={i18n.t('home.featureLightningFastTitle')}
              description={i18n.t('home.featureLightningFastDescription')}
              color="#4ecdc4"
              delay={600}
            />
            <FeatureCard
              icon="library"
              title={i18n.t('home.featureComprehensiveDatabaseTitle')}
              description={i18n.t('home.featureComprehensiveDatabaseDescription')}
              color="#ffe66d"
              delay={800}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{i18n.t('home.howToUseTitle')}</Text>
          <View style={styles.stepsContainer}>
            <StepCard
              step={1}
              icon="camera"
              title={i18n.t('home.stepTakePhotoTitle')}
              description={i18n.t('home.stepTakePhotoDescription')}
              color="#9b59b6"
              delay={200}
            />
            <StepCard
              step={2}
              icon="analytics"
              title={i18n.t('home.stepAIAnalysisTitle')}
              description={i18n.t('home.stepAIAnalysisDescription')}
              color="#ff6b6b"
              delay={400}
            />
            <StepCard
              step={3}
              icon="warning"
              title={i18n.t('home.stepAllergenDetectionTitle')}
              description={i18n.t('home.stepAllergenDetectionDescription')}
              color="#f39c12"
              delay={600}
            />
            <StepCard
              step={4}
              icon="checkmark-circle"
              title={i18n.t('home.stepEatSafelyTitle')}
              description={i18n.t('home.stepEatSafelyDescription')}
              color="#27ae60"
              delay={800}
            />
          </View>
        </View>

        <View style={styles.safetyNotice}>
          <View style={styles.safetyIcon}>
            <Ionicons name="medical" size={24} color="#e74c3c" />
          </View>
          <Text style={styles.safetyTitle}>{i18n.t('home.safetyNoticeTitle')}</Text>
          <Text style={styles.safetyText}>
            {i18n.t('home.safetyNoticeDescription')}
          </Text>
        </View>




        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {i18n.t('home.footerText')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  mainIconContainer: {
    marginBottom: 20,
  },
  mainIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#667eea",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  mainIconText: {
    fontSize: 50,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#2c3e50",
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 18,
    color: "#667eea",
    fontWeight: "600",
    marginBottom: 16,
  },
  appDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 20,
    textAlign: "center",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  featureCard: {
    width: (width - 55) / 2,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 8,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  stepsContainer: {
    gap: 20,
  },
  stepCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  stepContent: {
    flex: 1,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  safetyNotice: {
    backgroundColor: "#fef2f2",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: "#e74c3c",
  },
  safetyIcon: {
    alignSelf: "center",
    marginBottom: 12,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 8,
  },
  safetyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  getStartedButton: {
    backgroundColor: "#667eea",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  historyButton: {
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 16,
    marginHorizontal: "auto",
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  historyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default HomeScreen;