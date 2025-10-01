import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import i18n, { initI18n } from '@/languages/i18n';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isI18nInitialized, setIsI18nInitialized] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(i18n.locale);

  useEffect(() => {
    const initializeAndListen = async () => {
      await initI18n();
      setIsI18nInitialized(true);
      setCurrentLocale(i18n.locale);

      // Listen for locale changes
      i18n.onChange(() => {
        setCurrentLocale(i18n.locale);
      });
    };

    initializeAndListen();
  }, []);

  if (!loaded || !isI18nInitialized) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme} key={currentLocale}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="history" options={{ headerShown: true }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
