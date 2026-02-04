import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { StyleSheet } from "react-native";
import { useAuthStore } from "../stores/authstore";
import TodayScreen from "./today"; // 今日页面
import RememberScreen from "./remember"; // 回顾页面
import HomeScreen from "./home"; // 我的页面

type TabParamList = {
  remember: undefined;
  today: undefined;
  home: undefined;
};
type RootStackParamList = {
  signin: undefined;
};

const Tabs = createBottomTabNavigator<TabParamList>();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  const handleTabPress = (name: keyof TabParamList) => {
    if (name === "home") {
      if (!isLoggedIn) {
        navigation.navigate("signin");
        return false;
      }
    }
    return true;
  };

  return (
    <Tabs.Navigator
      initialRouteName="today"
      screenOptions={{
        tabBarStyle: styles.tabbarstyle,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
      screenListeners={{
        tabPress: (e) => {
          const route = e.target?.split("-")[0];
          if (route && !handleTabPress(route as keyof TabParamList)) {
            e.preventDefault();
          }
        },
      }}
    >
      <Tabs.Screen
        name="today"
        component={TodayScreen}
        options={{
          title: "今日",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="remember"
        component={RememberScreen}
        options={{
          title: "回顾",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="home"
        component={HomeScreen}
        options={{
          title: "我的",
          headerShown: false,
        }}
      />
    </Tabs.Navigator>
  );
}

const styles = StyleSheet.create({
  tabbarstyle: {
    height: 80,
    backgroundColor: "#ffffff",
  },
});
