import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="(tabs)">
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="beforepublish"
          options={{ headerShown: false }}
        ></Stack.Screen>
         <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen
          name="message"
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen
          name="configure"
          options={{ headerShown: false }}
        ></Stack.Screen>
         <Stack.Screen
          name="postCardDetail"
          options={{ headerShown: false }}
        ></Stack.Screen>
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
