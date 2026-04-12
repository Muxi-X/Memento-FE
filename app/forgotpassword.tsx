import Arrowleft from "@/assets/images/arrow-left.svg";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function ForgotPassword() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={["#BCDBFF", "#EFF7FF", "#FFFFFF"]}
        locations={[0, 0.48, 1]}
        style={styles.gradientBackground}
      >
        <View style={styles.forgetcard}>
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()}>
              <Arrowleft width={5.5} height={12} />
            </Pressable>
            <Text>找回密码</Text>
          </View>
          <View style={styles.body}>
            <Text>邮箱</Text>
            <TextInput
              style={styles.inputKuang}
              placeholder="请输入邮箱"
            ></TextInput>
            <Text>验证码</Text>
            <TextInput
              style={styles.inputKuang}
              placeholder="请输入验证码"
            ></TextInput>
            <Text>设置新密码</Text>
            <TextInput
              style={styles.inputKuang}
              placeholder="请输入新密码"
            ></TextInput>
            <Text>确认新密码</Text>
            <TextInput
              style={styles.inputKuang}
              placeholder="请再次确认新密码"
            ></TextInput>
          </View>
          <Pressable style={styles.loginBtn}>
            <Text style={styles.loginText}>确认</Text>
          </Pressable>
        </View>
      </LinearGradient>
  );
}
const styles = StyleSheet.create({
    gradientBackground: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  forgetcard: {
    backgroundColor: "#ffffff",
    width: 327,
    height: 460,
    borderRadius: 24,
    padding: 20,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 100,
  },
  body: {
    marginVertical: 20,
    display: "flex",
    flexDirection: "column",
    gap: 7,
  },
  inputKuang: {
    backgroundColor: "#EEEEEE",
    width: 296,
    height: 47,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  loginBtn: {
    backgroundColor: "#72B6FF",
    width: 296,
    height: 47,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loginText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
});
