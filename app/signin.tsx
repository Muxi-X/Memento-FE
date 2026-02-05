import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  Button,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Link, useNavigation } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Agree from "../assets/images/agree.svg";
import { loginPwd } from "./api/user";
type LoginType = "phone" | "password";
export default function SignIn() {
  const [loginway, setLoginway] = useState<LoginType>("password");
  const [agree, setAgree] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const handlelogin = async () => {
    if (!agree) {
      alert("请阅读并同意《隐私协议》和《用户协议》");
      return;
    }
    const token = await SecureStore.getItemAsync("signup_token");
    if (!token) {
      alert("请先注册");
    } else {
      const res = await loginPwd(email, password);
      if (res.status === 200) {
        const { access_token, refresh_token, expires_in, token_type } =
          res.data;
        await SecureStore.setItemAsync("access_token", access_token);
        await SecureStore.setItemAsync("refresh_token", refresh_token);
        // await SecureStore.setItemAsync("expires_in", expires_in.toString());
        await SecureStore.setItemAsync("token_type", token_type);
        navigation.navigate("index" as never); ;
      } else {
        alert("登录失败，请检查邮箱和密码");
      }
    }
  };
  return (
    <SafeAreaProvider style={styles.container}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={["#BCDBFF", "#EFF7FF", "#FFFFFF"]}
        locations={[0, 0.48, 1]}
        style={[styles.gradientBackground, styles.container]}
      >
        <View style={styles.tabcontainer}>
          <Pressable
            onPress={() => setLoginway("password")}
            style={[
              styles.way,
              loginway === "password"
                ? { backgroundColor: "#FFFFFF" }
                : { backgroundColor: "transparent" },
            ]}
          >
            <Text>密码登录</Text>
          </Pressable>
          <Pressable
            onPress={() => setLoginway("phone")}
            style={[
              styles.way,
              loginway === "phone"
                ? { backgroundColor: "#ffffff" }
                : { backgroundColor: "transparent" },
            ]}
          >
            <Text>验证码登录</Text>
          </Pressable>
        </View>
        <View style={styles.cardcontainer}>
          {loginway === "password" ? (
            <View>
              <View style={styles.passwordlist}>
                <View style={styles.smalllist}>
                  <Text style={styles.titletext}>邮箱</Text>
                  <TextInput
                    style={styles.Inputkuang}
                    placeholder="请输入邮箱"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                  ></TextInput>
                </View>
                <View>
                  <Text style={styles.titletext}>密码</Text>
                  <TextInput
                    style={styles.Inputkuang}
                    placeholder="请输入邮箱"
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor="#999"
                  ></TextInput>
                  <Link style={styles.getcode} href="/forgotpassword" asChild>
                    <Text style={styles.getcodeText}>忘记密码</Text>
                  </Link>
                </View>
              </View>
              <Pressable style={styles.loginBtn} onPress={handlelogin}>
                <Text style={styles.loginText}>登录</Text>
              </Pressable>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 8,
                }}
              >
                <Link href={"/signup"} asChild>
                  <Text style={styles.registerText}>新用户注册</Text>
                </Link>
              </View>
              <View style={styles.agree}>
                <Pressable
                  style={[
                    styles.agreeIcon,
                    agree
                      ? { borderColor: "#72B6FF" }
                      : { borderColor: "#999" },
                  ]}
                  onPress={() => setAgree(!agree)}
                >
                  {agree ? <Agree></Agree> : <></>}
                </Pressable>
                <Text>已阅读并同意《隐私协议》和《用户协议》</Text>
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.passwordlist}>
                <View style={styles.smalllist}>
                  <Text style={styles.titletext}>邮箱</Text>
                  <TextInput
                    style={styles.Inputkuang}
                    placeholder="请输入邮箱"
                    placeholderTextColor="#999"
                  ></TextInput>
                </View>
                <View style={{ position: "relative" }}>
                  <Text style={styles.titletext}>验证码</Text>
                  <TextInput
                    style={styles.Inputkuang}
                    placeholder="请输入邮箱"
                    placeholderTextColor="#999"
                  ></TextInput>
                  <Pressable style={styles.getcode}>
                    {/* 后续点击获取验证码 */}
                    <Text style={styles.getcodeText}>获取验证码</Text>
                  </Pressable>
                </View>
              </View>
              <Pressable style={styles.loginBtn}>
                <Text style={styles.loginText}>登录</Text>
              </Pressable>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 8,
                }}
              >
                <Link href={"/signup"} asChild>
                  <Text style={styles.registerText}>新用户注册</Text>
                </Link>
              </View>
              <View style={styles.agree}>
                <Pressable
                  style={[
                    styles.agreeIcon,
                    agree
                      ? { borderColor: "#72B6FF" }
                      : { borderColor: "#999" },
                  ]}
                  onPress={() => setAgree(!agree)}
                >
                  {agree ? <Agree></Agree> : <></>}
                </Pressable>
                <Text>已阅读并同意《隐私协议》和《用户协议》</Text>
              </View>
            </View>
          )}
        </View>
      </LinearGradient>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    width: "100%",
  },
  container: {
    display: "flex",
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cardcontainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 327,
    height: 380,
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 30,
  },
  tabcontainer: {
    display: "flex",
    flexDirection: "row",
    width: 327,
    justifyContent: "space-between",
    backgroundColor: "#EFF7FF",
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
  },
  way: {
    width: "50%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    backgroundColor: "#D8D8D8",
  },
  passwordlist: {
    display: "flex",
    flexDirection: "column",
    gap: 7,
    alignItems: "center",
  },
  iphonelist: {
    paddingTop: 36,
  },
  smalllist: {
    marginBottom: 17,
  },
  Inputkuang: {
    backgroundColor: "#EEEEEE",
    width: 296,
    height: 47,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 14,
    marginTop: 7,
  },
  titletext: {
    fontFamily: "Source Han Sans",
    fontSize: 14,
    color: "#666666",
    left: 10,
  },
  getcode: {
    position: "absolute",
    bottom: 13,
    right: 19,
  },
  getcodeText: {
    color: "#72B6FF",
    fontSize: 14,
  },
  loginBtn: {
    backgroundColor: "#72B6FF",
    width: 296,
    height: 47,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 33,
  },
  loginText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  registerText: {
    marginTop: 10,
    color: "#A9D1FF",
  },
  agree: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingLeft: 10,
    gap: 8,
  },
  agreeIcon: {
    borderWidth: 1,
    height: 14,
    width: 14,
    borderRadius: 7,
  },
});
