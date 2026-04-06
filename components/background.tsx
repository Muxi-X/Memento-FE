import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
export default function Background({ children }: { children: React.ReactNode }) {
  return (
    <KeyboardAvoidingView 
     behavior={"padding"}
      keyboardVerticalOffset={100}
    >
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={["#BCDBFF", "#EFF7FF", "#FFFFFF"]}
      locations={[0, 0.48, 1]}
      style={styles.gradientBackground}
    >
      {children}
    </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    width: "100%",
    position: "relative",
  },
});
