import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { clearCachedToken, setUnauthorizedHandler } from './api/request';
import { bumpAnalyticsSession } from './api/analytics';
import useDailyPromptStore from './stores/useDailyPromptStore';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  // 注册全局 401 处理：清理 token、提示状态、事件队列并引导登录
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearCachedToken();
      useDailyPromptStore.getState().bumpSession();
      bumpAnalyticsSession();
      router.replace('/signin');
    });
    return () => setUnauthorizedHandler(() => {});
  }, [router]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="index">
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="message" options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="configure" options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="postCardDetail" options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="setAuthdata" options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="yesterdayfind" options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="updateName" options={{ headerShown: false }}></Stack.Screen>
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
