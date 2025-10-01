
import i18n, { LANGUAGE_STORAGE_KEY } from "@/languages/i18n";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export interface AllergenItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  isSelected: boolean;
  severity: "mild" | "moderate" | "severe";
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface AllergyProfile {
  personalInfo: {
    name: string;
    age: string;
    medicalId: string;
  };
  allergens: AllergenItem[];
  emergencyContacts: EmergencyContact[];
  dietaryPreferences: string[];
  medicalNotes: string;
  notificationsEnabled: boolean;
  autoScanEnabled: boolean;
}

const AppColors = {
  primary: "#667eea",
  danger: "#ff6b6b",
  success: "#4ecdc4",
  warning: "#ffe66d",
  purple: "#9b59b6",
  orange: "#f39c12",
  green: "#27ae60",
  error: "#e74c3c",
  background: "#f8f9fa",
  textPrimary: "#2c3e50",
  textSecondary: "#666",
  textLight: "#999",
  cardBackground: "white",
  shadow: "#000",
  borderColor: "#e0e0e0",
  paleSuccess: "rgba(78, 205, 196, 0.2)",
  paleWarning: "rgba(255, 230, 109, 0.2)",
  paleDanger: "rgba(255, 107, 107, 0.2)",
};

const defaultProfile: AllergyProfile = {
  personalInfo: { name: "", age: "", medicalId: "" },
  allergens: [],
  emergencyContacts: [{ name: "", phone: "", relationship: "" }],
  dietaryPreferences: [],
  medicalNotes: "",
  notificationsEnabled: true,
  autoScanEnabled: true,
};

const PROFILE_STORAGE_KEY = "userAllergyProfile";

const AllergyProfileScreen: FC = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<AllergyProfile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("personal");
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [currentLanguage, setCurrentLanguage] = useState(i18n.locale);

  const commonAllergensData: AllergenItem[] = React.useMemo(() => [
    {
      id: "1",
      name: i18n.t('explore.allergenPeanuts'),
      icon: "leaf-outline",
      color: AppColors.green,
      isSelected: false,
      severity: "mild",
    },
    {
      id: "2",
      name: i18n.t('explore.allergenTreeNuts'),
      icon: "leaf",
      color: AppColors.green,
      isSelected: false,
      severity: "mild",
    },
    {
      id: "3",
      name: i18n.t('explore.allergenDairy'),
      icon: "cafe-outline",
      color: AppColors.primary,
      isSelected: false,
      severity: "mild",
    },
    {
      id: "4",
      name: i18n.t('explore.allergenEggs'),
      icon: "egg-outline",
      color: AppColors.warning,
      isSelected: false,
      severity: "mild",
    },
    {
      id: "5",
      name: i18n.t('explore.allergenFish'),
      icon: "fish-outline",
      color: AppColors.primary,
      isSelected: false,
      severity: "mild",
    },
    {
      id: "6",
      name: i18n.t('explore.allergenShellfish'),
      icon: "bug-outline",
      color: AppColors.danger,
      isSelected: false,
      severity: "mild",
    },
    {
      id: "7",
      name: i18n.t('explore.allergenSoy'),
      icon: "cube-outline",
      color: AppColors.purple,
      isSelected: false,
      severity: "mild",
    },
    {
      id: "8",
      name: i18n.t('explore.allergenWheatGluten'),
      icon: "nutrition-outline",
      color: AppColors.orange,
      isSelected: false,
      severity: "mild",
    },
    {
      id: "9",
      name: i18n.t('explore.allergenSesame'),
      icon: "sync-circle-outline",
      color: AppColors.warning,
      isSelected: false,
      severity: "mild",
    },
    {
      id: "10",
      name: i18n.t('explore.allergenMustard'),
      icon: "flower-outline",
      color: AppColors.orange,
      isSelected: false,
      severity: "mild",
    },
  ], [currentLanguage]);

  const dietaryOptionsData = React.useMemo(() => [
    { name: i18n.t('explore.dietaryVegetarian'), icon: "accessibility-outline", color: AppColors.green },
    { name: i18n.t('explore.dietaryVegan'), icon: "leaf-sharp", color: AppColors.green },
    { name: i18n.t('explore.dietaryKosher'), icon: "star-outline", color: AppColors.primary },
    { name: i18n.t('explore.dietaryHalal'), icon: "moon-outline", color: AppColors.purple },
    { name: i18n.t('explore.dietaryKeto'), icon: "flash-outline", color: AppColors.danger },
    { name: i18n.t('explore.dietaryLowCarb'), icon: "trending-down-outline", color: AppColors.orange },
    { name: i18n.t('explore.dietaryLowSodium'), icon: "water-outline", color: AppColors.primary },
    {
      name: i18n.t('explore.dietarySugarFree'),
      icon: "close-circle-outline",
      color: AppColors.error,
    },
  ], [currentLanguage]);

  const sectionsData = React.useMemo(() => [
    {
      id: "personal",
      title: i18n.t('explore.sectionPersonal'),
      icon: "person-outline",
      activeColor: AppColors.primary,
    },
    {
      id: "allergens",
      title: i18n.t('explore.sectionAllergens'),
      icon: "warning-outline",
      activeColor: AppColors.danger,
    },
    {
      id: "emergency",
      title: i18n.t('explore.sectionEmergency'),
      icon: "call-outline",
      activeColor: AppColors.success,
    },
    {
      id: "dietary",
      title: i18n.t('explore.sectionDietary'),
      icon: "nutrition-outline",
      activeColor: AppColors.orange,
    },
    {
      id: "settings",
      title: i18n.t('explore.sectionSettings'),
      icon: "settings-outline",
      activeColor: AppColors.primary,
    },
  ], [currentLanguage]);


  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeSection, fadeAnim, slideAnim]);

  useEffect(() => {
    const loadProfileAndLanguage = async () => {
      try {
        let newProfile: AllergyProfile = {
          ...defaultProfile,
          allergens: commonAllergensData.map(a => ({ ...a })),
          dietaryPreferences: dietaryOptionsData.map(d => d.name),
        };

        const jsonValue = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        if (jsonValue != null) {
          const storedProfile: AllergyProfile = JSON.parse(jsonValue);

          newProfile.personalInfo = storedProfile.personalInfo;
          newProfile.medicalNotes = storedProfile.medicalNotes;
          newProfile.notificationsEnabled = storedProfile.notificationsEnabled;
          newProfile.autoScanEnabled = storedProfile.autoScanEnabled;
          newProfile.emergencyContacts = storedProfile.emergencyContacts;

          newProfile.allergens = newProfile.allergens.map(defaultAllergen => {
            const storedAllergen = storedProfile.allergens.find(sa => sa.id === defaultAllergen.id);
            return storedAllergen ? { ...defaultAllergen, isSelected: storedAllergen.isSelected, severity: storedAllergen.severity } : defaultAllergen;
          });

          newProfile.dietaryPreferences = storedProfile.dietaryPreferences;
        }

        setProfile(newProfile);

        const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (storedLanguage) {
          i18n.locale = storedLanguage;
          setCurrentLanguage(storedLanguage);
        }
      } catch (_e) {
        Alert.alert(i18n.t('common.error'), i18n.t('explore.failedToLoadProfile'));
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileAndLanguage();
  }, [currentLanguage, commonAllergensData, dietaryOptionsData]);

  const toggleAllergen = (allergenId: string) => {
    Vibration.vibrate(10);
    setProfile((prev) => ({
      ...prev,
      allergens: prev.allergens.map((allergen) =>
        allergen.id === allergenId
          ? { ...allergen, isSelected: !allergen.isSelected }
          : allergen
      ),
    }));
  };

  const changeSeverity = (
    allergenId: string,
    severity: "mild" | "moderate" | "severe"
  ) => {
    Vibration.vibrate(10);
    setProfile((prev) => ({
      ...prev,
      allergens: prev.allergens.map((allergen) =>
        allergen.id === allergenId ? { ...allergen, severity } : allergen
      ),
    }));
  };

  const toggleDietaryPreference = (preference: string) => {
    Vibration.vibrate(10);
    setProfile((prev) => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(preference)
        ? prev.dietaryPreferences.filter((p) => p !== preference)
        : [...prev.dietaryPreferences, preference],
    }));
  };

  const updateEmergencyContact = (
    index: number,
    field: keyof EmergencyContact,
    value: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      ),
    }));
  };

  const addEmergencyContact = () => {
    setProfile((prev) => ({
      ...prev,
      emergencyContacts: [
        ...prev.emergencyContacts,
        { name: "", phone: "", relationship: "" },
      ],
    }));
  };

  const removeEmergencyContact = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index),
    }));
  };

  const handleSectionChange = (sectionId: string) => {
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    setActiveSection(sectionId);
  };

  const handleSave = async () => {
    if (!profile.personalInfo.name.trim()) {
      Alert.alert(i18n.t('common.error'), i18n.t('explore.enterNameError'));
      return;
    }

    try {
      const jsonValue = JSON.stringify(profile);
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, jsonValue);
      Alert.alert(i18n.t('common.success'), i18n.t('explore.profileSavedSuccess'), [
        { text: i18n.t('common.ok'), onPress: () => navigation.goBack() },
      ]);
    } catch (_e) {
      Alert.alert(i18n.t('common.error'), i18n.t('explore.failedToSaveProfile'));
    }
  };

  const handleLanguageChange = async (lang: string) => {
    Vibration.vibrate(10);
    i18n.locale = lang;
    setCurrentLanguage(lang);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    Alert.alert(i18n.t('common.success'), i18n.t('explore.languageChangedSuccess', { language: lang === 'en' ? i18n.t('explore.languageEnglish') : i18n.t('explore.languageThai') }));
  };

  const getSeverityData = (severity: string) => {
    switch (severity) {
      case "mild":
        return {
          color: AppColors.success,
          icon: "checkmark-circle-outline",
          bg: AppColors.paleSuccess,
          text: "#4CAF50",
          label: i18n.t('common.mild')
        };
      case "moderate":
        return {
          color: AppColors.warning,
          icon: "warning-outline",
          bg: AppColors.paleWarning,
          text: "#FF9800",
          label: i18n.t('common.moderate')
        };
      case "severe":
        return {
          color: AppColors.danger,
          icon: "alert-circle-outline",
          bg: AppColors.paleDanger,
          text: "#F44336",
          label: i18n.t('common.severe')
        };
      default:
        return {
          color: AppColors.textSecondary,
          icon: "help-circle-outline",
          bg: "#F5F5F5",
          text: AppColors.textSecondary,
        };
    }
  };

  const SectionCard: FC<{
    section: any;
    isActive: boolean;
    onPress: () => void;
  }> = ({ section, isActive, onPress }) => (
    <TouchableOpacity
      style={[
        styles.sectionCard,
        {
          backgroundColor: isActive
            ? section.activeColor
            : AppColors.cardBackground,
          borderColor: isActive ? section.activeColor : AppColors.borderColor,
          borderWidth: 2,
        },
        isActive && styles.activeSectionCardShadow,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.sectionCardContent}>
        <Ionicons
          name={section.icon}
          size={24}
          color={isActive ? AppColors.cardBackground : section.activeColor}
        />
        <Text
          style={[
            styles.sectionCardTitle,
            { color: isActive ? AppColors.cardBackground : AppColors.textPrimary },
          ]}
        >
          {section.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const AllergenCard: FC<{ allergen: AllergenItem }> = ({ allergen }) => {
    const severityInfo = getSeverityData(allergen.severity);
    return (
      <View style={styles.allergenCard}>
        <TouchableOpacity
          style={[
            styles.allergenMain,
            {
              backgroundColor: allergen.isSelected
                ? `${allergen.color}30`
                : AppColors.cardBackground,
              borderColor: allergen.isSelected
                ? allergen.color
                : AppColors.borderColor,
            },
          ]}
          onPress={() => toggleAllergen(allergen.id)}
        >
          <View style={styles.allergenLeft}>
            <View
              style={[
                styles.allergenIconContainer,
                { backgroundColor: allergen.color },
              ]}
            >
              <Ionicons
                name={allergen.icon as any}
                size={20}
                color={AppColors.cardBackground}
              />
            </View>
            <Text style={styles.allergenName}>{allergen.name}</Text>
          </View>
          <View style={styles.allergenRight}>
            {allergen.isSelected && (
              <View
                style={[
                  styles.severityIndicator,
                  { backgroundColor: severityInfo.bg },
                ]}
              >
                <Ionicons
                  name={severityInfo.icon as any}
                  size={16}
                  color={severityInfo.text}
                />
              </View>
            )}
            <View
              style={[
                styles.checkbox,
                {
                  backgroundColor: allergen.isSelected
                    ? allergen.color
                    : "transparent",
                  borderColor: allergen.isSelected
                    ? allergen.color
                    : AppColors.borderColor,
                },
              ]}
            >
              {allergen.isSelected && (
                <Ionicons name="checkmark" size={16} color={AppColors.cardBackground} />
              )}
            </View>
          </View>
        </TouchableOpacity>

        {allergen.isSelected && (
          <View style={styles.severitySection}>
            <Text style={styles.severityLabel}>{i18n.t('explore.severityLevelLabel')}</Text>
            <View style={styles.severityButtons}>
              {["mild", "moderate", "severe"].map((severity) => {
                const data = getSeverityData(severity);
                const isSelected = allergen.severity === severity;
                return (
                  <TouchableOpacity
                    key={severity}
                    style={[
                      styles.severityButton,
                      {
                        backgroundColor: isSelected ? data.color : data.bg,
                      },
                    ]}
                    onPress={() =>
                      changeSeverity(allergen.id, severity as any)
                    }
                  >
                    <Ionicons
                      name={data.icon as any}
                      size={16}
                      color={isSelected ? AppColors.cardBackground : data.text}
                    />
                    <Text
                      style={[
                        styles.severityButtonText,
                        { color: isSelected ? AppColors.cardBackground : data.text },
                      ]}
                    >
                      {data.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </View>
    );
  };

  const EmergencyContactCard: FC<{
    contact: EmergencyContact;
    index: number;
  }> = ({ contact, index }) => (
    <View style={styles.emergencyContactCard}>
      <View
        style={[
          styles.emergencyContactHeader,
          { backgroundColor: AppColors.success },
        ]}
      >
        <View style={styles.emergencyContactInfo}>
          <Text style={styles.emergencyContactTitle}>
            {i18n.t('explore.emergencyContactTitle', { index: index + 1 })}
          </Text>
          <Text style={styles.emergencyContactSubtitle}>
            {contact.name || i18n.t('common.notSpecified')}
          </Text>
        </View>
        {profile.emergencyContacts.length > 1 && (
          <TouchableOpacity
            onPress={() => removeEmergencyContact(index)}
            style={styles.removeContactButton}
          >
            <Ionicons name="close" size={20} color={AppColors.cardBackground} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.emergencyContactForm}>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color={AppColors.textSecondary} />
          <TextInput
            style={styles.inputField}
            value={contact.name}
            onChangeText={(text) => updateEmergencyContact(index, "name", text)}
            placeholder={i18n.t('explore.contactFullNamePlaceholder')}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color={AppColors.textSecondary} />
          <TextInput
            style={styles.inputField}
            value={contact.phone}
            onChangeText={(text) =>
              updateEmergencyContact(index, "phone", text)
            }
            placeholder={i18n.t('explore.contactPhoneNumberPlaceholder')}
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="heart-outline" size={20} color={AppColors.textSecondary} />
          <TextInput
            style={styles.inputField}
            value={contact.relationship}
            onChangeText={(text) =>
              updateEmergencyContact(index, "relationship", text)
            }
            placeholder={i18n.t('explore.contactRelationshipPlaceholder')}
            placeholderTextColor="#999"
          />
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View
          style={[styles.loadingBox, { backgroundColor: AppColors.primary }]}
        >
          <ActivityIndicator size="large" color={AppColors.cardBackground} />
          <Text style={styles.loadingText}>{i18n.t('explore.loadingProfile')}</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: AppColors.primary }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="chevron-back" size={24} color={AppColors.cardBackground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{i18n.t('explore.allergyProfileTitle')}</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Ionicons name="checkmark" size={20} color={AppColors.cardBackground} />
          <Text style={styles.saveButtonText}>{i18n.t('common.save')}</Text>
        </TouchableOpacity>
      </View>

      {/* Section Navigation */}
      <View style={styles.sectionNavigation}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sectionScrollContainer}
        >
          {sectionsData.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              isActive={activeSection === section.id}
              onPress={() => handleSectionChange(section.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView
          style={styles.contentScroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Personal Information Section */}
          {activeSection === "personal" && (
            <View style={styles.section}>
              <View
                style={[
                  styles.sectionHeader,
                  { backgroundColor: AppColors.primary },
                ]}
              >
                <Text style={styles.sectionTitle}>
                  👤 {i18n.t('explore.sectionPersonal')}
                </Text>
                <Text style={styles.sectionSubtitle}>
                  {i18n.t('explore.personalSubtitle')}
                </Text>
              </View>

              <View style={styles.sectionContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{i18n.t('explore.fullNameLabel')}</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color={AppColors.textSecondary} />
                    <TextInput
                      style={styles.inputField}
                      value={profile.personalInfo.name}
                      onChangeText={(text) =>
                        setProfile((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, name: text },
                        }))
                      }
                      placeholder={i18n.t('explore.fullNamePlaceholder')}
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{i18n.t('explore.ageLabel')}</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="calendar-outline" size={20} color={AppColors.textSecondary} />
                    <TextInput
                      style={styles.inputField}
                      value={profile.personalInfo.age}
                      onChangeText={(text) =>
                        setProfile((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, age: text },
                        }))
                      }
                      placeholder={i18n.t('explore.agePlaceholder')}
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{i18n.t('explore.medicalIdLabel')}</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="medical-outline" size={20} color={AppColors.textSecondary} />
                    <TextInput
                      style={styles.inputField}
                      value={profile.personalInfo.medicalId}
                      onChangeText={(text) =>
                        setProfile((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, medicalId: text },
                        }))
                      }
                      placeholder={i18n.t('explore.medicalIdPlaceholder')}
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Allergens Section */}
          {activeSection === "allergens" && (
            <View style={styles.section}>
              <View
                style={[
                  styles.sectionHeader,
                  { backgroundColor: AppColors.danger },
                ]}
              >
                <Text style={styles.sectionTitle}>⚠️ {i18n.t('explore.sectionAllergens')}</Text>
                <Text style={styles.sectionSubtitle}>
                  {i18n.t('explore.allergensSubtitle')}
                </Text>
              </View>

              <View style={styles.sectionContent}>
                {profile.allergens.map((allergen) => (
                  <AllergenCard key={allergen.id} allergen={allergen} />
                ))}
              </View>
            </View>
          )}

          {/* Emergency Contacts Section */}
          {activeSection === "emergency" && (
            <View style={styles.section}>
              <View
                style={[
                  styles.sectionHeader,
                  { backgroundColor: AppColors.success },
                ]}
              >
                <Text style={styles.sectionTitle}>🚨 {i18n.t('explore.sectionEmergency')}</Text>
                <Text style={styles.sectionSubtitle}>
                  {i18n.t('explore.emergencySubtitle')}
                </Text>
              </View>

              <View style={styles.sectionContent}>
                {profile.emergencyContacts.map((contact, index) => (
                  <EmergencyContactCard
                    key={index}
                    contact={contact}
                    index={index}
                  />
                ))}

                <TouchableOpacity
                  style={[
                    styles.addContactButton,
                    { backgroundColor: AppColors.success },
                  ]}
                  onPress={addEmergencyContact}
                >
                  <Ionicons name="add" size={24} color={AppColors.cardBackground} />
                  <Text style={styles.addContactText}>
                    {i18n.t('explore.addEmergencyContact')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Dietary Preferences Section */}
          {activeSection === "dietary" && (
            <View style={styles.section}>
              <View
                style={[
                  styles.sectionHeader,
                  { backgroundColor: AppColors.orange },
                ]}
              >
                <Text style={styles.sectionTitle}>🥗 {i18n.t('explore.sectionDietary')}</Text>
                <Text style={styles.sectionSubtitle}>
                  {i18n.t('explore.dietarySubtitle')}
                </Text>
              </View>

              <View style={styles.sectionContent}>
                <View style={styles.dietaryGrid}>
                  {dietaryOptionsData.map((option) => {
                    const isSelected = profile.dietaryPreferences.includes(
                      option.name
                    );
                    return (
                      <TouchableOpacity
                        key={option.name}
                        style={[
                          styles.dietaryCard,
                          {
                            backgroundColor: isSelected
                              ? `${option.color}30`
                              : AppColors.cardBackground,
                            borderColor: isSelected
                              ? option.color
                              : AppColors.borderColor,
                          },
                        ]}
                        onPress={() => toggleDietaryPreference(option.name)}
                      >
                        <View
                          style={[
                            styles.dietaryIconContainer,
                            { backgroundColor: option.color },
                          ]}
                        >
                          <Ionicons
                            name={option.icon as any}
                            size={20}
                            color={AppColors.cardBackground}
                          />
                        </View>
                        <Text
                          style={[
                            styles.dietaryText,
                            { color: isSelected ? option.color : AppColors.textPrimary },
                          ]}
                        >
                          {option.name}
                        </Text>
                        {isSelected && (
                          <View
                            style={[
                              styles.dietaryCheck,
                              { backgroundColor: option.color },
                            ]}
                          >
                            <Ionicons name="checkmark" size={12} color={AppColors.cardBackground} />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{i18n.t('explore.medicalNotesLabel')}</Text>
                  <View style={styles.textAreaContainer}>
                    <TextInput
                      style={styles.textArea}
                      value={profile.medicalNotes}
                      onChangeText={(text) =>
                        setProfile((prev) => ({
                          ...prev,
                          medicalNotes: text,
                        }))
                      }
                      placeholder={i18n.t('explore.medicalNotesPlaceholder')}
                      placeholderTextColor="#999"
                      multiline
                      numberOfLines={4}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Settings Section */}
          {activeSection === "settings" && (
            <View style={styles.section}>
              <View
                style={[
                  styles.sectionHeader,
                  { backgroundColor: AppColors.primary },
                ]}
              >
                <Text style={styles.sectionTitle}>⚙️ {i18n.t('explore.sectionSettings')}</Text>
                <Text style={styles.sectionSubtitle}>
                  {i18n.t('explore.settingsSubtitle')}
                </Text>
              </View>

              <View style={styles.sectionContent}>
                <View style={styles.settingCard}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIconContainer}>
                      <Ionicons name="notifications-outline" size={24} color={AppColors.primary} />
                    </View>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingTitle}>
                        {i18n.t('explore.allergyNotificationsTitle')}
                      </Text>
                      <Text style={styles.settingDescription}>
                        {i18n.t('explore.allergyNotificationsDescription')}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={profile.notificationsEnabled}
                    onValueChange={(value) =>
                      setProfile((prev) => ({
                        ...prev,
                        notificationsEnabled: value,
                      }))
                    }
                    trackColor={{
                      false: AppColors.borderColor,
                      true: AppColors.primary,
                    }}
                    thumbColor={AppColors.cardBackground}
                  />
                </View>

                <View style={styles.settingCard}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIconContainer}>
                      <Ionicons name="scan-outline" size={24} color={AppColors.primary} />
                    </View>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingTitle}>{i18n.t('explore.autoScanModeTitle')}</Text>
                      <Text style={styles.settingDescription}>
                        {i18n.t('explore.autoScanModeDescription')}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={profile.autoScanEnabled}
                    onValueChange={(value) =>
                      setProfile((prev) => ({
                        ...prev,
                        autoScanEnabled: value,
                      }))
                    }
                    trackColor={{
                      false: AppColors.borderColor,
                      true: AppColors.primary,
                    }}
                    thumbColor={AppColors.cardBackground}
                  />
                </View>

                {/* Language Setting Card */}
                <View style={styles.settingCard}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIconContainer}>
                      <Ionicons name="language-outline" size={24} color={AppColors.primary} />
                    </View>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingTitle}>
                        {i18n.t('explore.languageSettingTitle')}
                      </Text>
                      <Text style={styles.settingDescription}>
                        {i18n.t('explore.languageSettingDescription')}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.languagePickerContainer}>
                    <TouchableOpacity
                      style={[
                        styles.languageOption,
                        currentLanguage === 'en' && styles.selectedLanguageOption,
                      ]}
                      onPress={() => handleLanguageChange('en')}
                    >
                      <Text
                        style={[
                          styles.languageOptionText,
                          currentLanguage === 'en' && styles.selectedLanguageOptionText,
                        ]}
                      >
                        {i18n.t('explore.languageEnglish')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.languageOption,
                        currentLanguage === 'th' && styles.selectedLanguageOption,
                      ]}
                      onPress={() => handleLanguageChange('th')}
                    >
                      <Text
                        style={[
                          styles.languageOptionText,
                          currentLanguage === 'th' && styles.selectedLanguageOptionText,
                        ]}
                      >
                        {i18n.t('explore.languageThai')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColors.background,
  },
  loadingBox: {
    padding: 40,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: AppColors.cardBackground,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: AppColors.cardBackground,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  saveButtonText: {
    color: AppColors.cardBackground,
    fontWeight: "600",
  },
  sectionNavigation: {
    backgroundColor: AppColors.background,
    paddingVertical: 10,
  },
  sectionScrollContainer: {
    paddingHorizontal: 15,
    gap: 15,
  },
  sectionCard: {
    width: width * 0.28,
    height: 100,
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  activeSectionCardShadow: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  sectionCardContent: {
    alignItems: "center",
  },
  sectionEmoji: {
    fontSize: 20,
    marginBottom: 5,
  },
  sectionCardTitle: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 5,
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  contentScroll: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 16,
    padding: 20,
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: AppColors.cardBackground,
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 22,
  },
  sectionContent: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.borderColor,
    paddingHorizontal: 15,
    paddingVertical: 5,
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    color: AppColors.textPrimary,
    paddingVertical: 12,
    paddingLeft: 10,
  },
  allergenCard: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: AppColors.cardBackground,
    borderWidth: 2,
    borderColor: AppColors.borderColor,
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  allergenMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderWidth: 2,
    borderRadius: 12,
  },
  allergenLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  allergenIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  allergenName: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.textPrimary,
  },
  allergenRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  severityIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  severitySection: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: AppColors.borderColor,
  },
  severityLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.textSecondary,
    marginBottom: 10,
  },
  severityButtons: {
    flexDirection: "row",
    gap: 10,
  },
  severityButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    gap: 5,
    borderWidth: 1,
    borderColor: AppColors.borderColor,
  },
  severityButtonText: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  emergencyContactCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: AppColors.cardBackground,
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyContactHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
  emergencyContactInfo: {
    flex: 1,
  },
  emergencyContactTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: AppColors.cardBackground,
  },
  emergencyContactSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  removeContactButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  emergencyContactForm: {
    padding: 15,
    gap: 15,
  },
  addContactButton: {
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addContactText: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.cardBackground,
  },
  dietaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  dietaryCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
    minWidth: (width - 60) / 2 - 5,
    position: "relative",
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dietaryIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  dietaryText: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  dietaryCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -5,
    right: -5,
  },
  textAreaContainer: {
    backgroundColor: AppColors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.borderColor,
    padding: 15,
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    fontSize: 16,
    color: AppColors.textPrimary,
    textAlignVertical: "top",
    minHeight: 100,
  },
  settingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.cardBackground,
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: AppColors.borderColor,
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: AppColors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: AppColors.textSecondary,
    lineHeight: 20,
  },
  languagePickerContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AppColors.borderColor,
  },
  languageOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: AppColors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedLanguageOption: {
    backgroundColor: AppColors.primary,
  },
  languageOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  selectedLanguageOptionText: {
    color: AppColors.cardBackground,
  },
});

export default AllergyProfileScreen;