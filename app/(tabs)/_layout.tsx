import React, { useEffect } from "react";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter,Tabs } from "expo-router";

import Icon3 from "../../assets/images/tabicon3.svg"
type TabParamList = {
  today: undefined;
  remember: undefined;
  home: undefined;
}
function TabbarIcon(props: any) {
  return<Icon3 {...props} />
}
export default function TabLayout() {
  const colorScheme = useColorScheme();
 const router=useRouter();

  const handleTabPress = async (name: keyof TabParamList) => {
    if (name === "home") {
      const access_token = await SecureStore.getItemAsync("access_token");
      if (!access_token) {
      router.navigate("/signin");
      return false;
    } else {
      router.navigate("/home");
      }
    }
    return true;
  };

  return (
    <Tabs
      initialRouteName="today"
      screenOptions={{
        tabBarStyle: styles.tabbarstyle,
        tabBarActiveTintColor: "#72B6FF"
        
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
        options={{
          title: "今日",
          headerShown: false,
          tabBarIcon:({color})=><TabbarIcon color={color}/>
        }}

      />
      <Tabs.Screen
        name="remember"
        
        options={{
          title: "回顾",
          headerShown: false,
          tabBarIcon:({color})=><TabbarIcon color={color}/>
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "我的",
          headerShown: false,
          tabBarIcon:({color})=><TabbarIcon color={color}/>
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabbarstyle: {
    height: 80,
    backgroundColor: "#ffffff",
  },
});
