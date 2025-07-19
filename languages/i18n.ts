import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import en from '../languages/en.json';
import th from '../languages/thai.json';

const i18n = new I18n();

i18n.enableFallback = true;
i18n.store({ en, th });

export const LANGUAGE_STORAGE_KEY = "userLanguage"; // Define the key

export const initI18n = async () => {
  try {
    const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage) {
      i18n.locale = storedLanguage;
    } else {
      i18n.locale = getLocales()[0].languageCode ?? 'en';
    }
  } catch (error) {
    console.error("Failed to load language from storage", error);
    i18n.locale = getLocales()[0].languageCode ?? 'en'; // Fallback in case of error
  }
};

export default i18n;