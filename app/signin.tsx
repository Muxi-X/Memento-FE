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
import { loginPwd, sendlogincode, loginPhone } from "./api/user";
import Mmnoeyes from "../assets/images/Mmnoeyes.svg";
import Mmeyes from "../assets/images/Mmeyes.svg";

type LoginType = "phone" | "password";
export default function SignIn() {
  const [loginway, setLoginway] = useState<LoginType>("password");
  const [agree, setAgree] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [Mm, setMm] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const handleloginByPwd = async () => {
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
        await SecureStore.setItemAsync("expires_in", expires_in.toString());
        await SecureStore.setItemAsync("token_type", token_type);
        navigation.navigate("index" as never);
      } else {
        alert("登录失败，请检查邮箱和密码");
      }
    }
  };
  const handleSendCode = async () => {
    if (!email) {
      alert("请输入邮箱");
      return;
    }
    const res = await sendlogincode(email);
    if (res.status === 204) {
      alert("验证码已发送，请注意查收");
    } else {
      alert("验证码发送失败，请稍后再试");
    }
  };
  const handldeloginByPhone = async () => {
    if (!agree) {
      alert("请阅读并同意《隐私协议》和《用户协议》");
      return;
    }
    const res = await loginPhone(email, code);
    if (res.status === 200) {
      const { access_token, refresh_token, expires_in, token_type } = res.data;
      await SecureStore.setItemAsync("access_token", access_token);
      await SecureStore.setItemAsync("refresh_token", refresh_token);
      await SecureStore.setItemAsync("expires_in", expires_in.toString());
      await SecureStore.setItemAsync("token_type", token_type);
      navigation.navigate("index" as never);
    } else {
      alert("登录失败，请检查邮箱和验证码");
    }
  };

  return (
    <SafeAreaProvider>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={["#BCDBFF", "#EFF7FF", "#FFFFFF"]}
        locations={[0, 0.48, 1]}
        style={[styles.gradientBackground]}
      >
        {Mm ? (
          <Mmnoeyes style={styles.Mm}></Mmnoeyes>
        ) : (
          <Mmeyes style={styles.Mm}></Mmeyes>
        )}
        <View style={styles.card}>
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
              <Pressable  onPress={() => setLoginway("password")} style={{zIndex:1}} >
                <Text style={loginway === "password" && styles.wayText}>密码登录</Text>
                
              </Pressable>
              {loginway === "password" && <View style={styles.line}></View>}
            </Pressable>
            <View
              style={[
                styles.way,
                loginway === "phone"
                  ? { backgroundColor: "#ffffff" }
                  : { backgroundColor: "transparent" },
              ]}
            >
                 <Pressable  onPress={() => setLoginway("phone")} style={{zIndex:2}} >
                <Text style={loginway === "phone" && styles.wayText}>验证码登陆</Text>
              </Pressable>
              {loginway === "phone" && <View style={styles.line}></View>}
            </View>
          </View>
          <View
            style={[
              styles.cardcontainer,
              loginway === "phone"
                ? { borderTopLeftRadius: 24 }
                : { borderTopRightRadius: 24 },
            ]}
          >
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
                      placeholder="请输入密码"
                      onChangeText={(text) => setPassword(text)}
                      secureTextEntry={true}
                      value={password}
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholderTextColor="#999"
                      onFocus={() => {
                        setMm(true);
                      }}
                      onBlur={() => {
                        setMm(false);
                      }}
                    ></TextInput>
                    <Link style={styles.getcode} href="/forgotpassword" asChild>
                      <Text style={styles.getcodeText}>忘记密码</Text>
                    </Link>
                  </View>
                </View>
                <Pressable style={styles.loginBtn} onPress={handleloginByPwd}>
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
                    <Text style={styles.registerText}>注册新用户</Text>
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
                  <Text style={{ color: "#999999", fontSize: 12 }}>
                    已阅读并同意
                  </Text>
                  <Text style={{ color: "#72B6FF", fontSize: 12 }}>
                    《隐私协议》
                  </Text>
                  <Text style={{ color: "#999999", fontSize: 12 }}>和</Text>
                  <Text style={{ color: "#72B6FF", fontSize: 12 }}>
                    《用户协议》
                  </Text>
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
                      value={email}
                      onChangeText={(text) => setEmail(text)}
                    ></TextInput>
                  </View>
                  <View style={{ position: "relative" }}>
                    <Text style={styles.titletext}>验证码</Text>
                    <TextInput
                      style={styles.Inputkuang}
                      placeholder="请输入邮箱"
                      placeholderTextColor="#999"
                      value={code}
                      onChangeText={(text) => setCode(text)}
                    ></TextInput>
                    <Pressable style={styles.getcode} onPress={handleSendCode}>
                      <Text style={styles.getcodeText}>获取验证码</Text>
                    </Pressable>
                  </View>
                </View>
                <Pressable
                  style={styles.loginBtn}
                  onPress={handldeloginByPhone}
                >
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
                  <Text style={{ color: "#999999" }}>已阅读并同意</Text>
                  <Text style={{ color: "#72B6FF" }}>《隐私协议》</Text>
                  <Text style={{ color: "#999999" }}>和</Text>
                  <Text style={{ color: "#72B6FF" }}>《用户协议》</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    width: "100%",
    alignItems: "center",

    position: "relative",
  },
  Mm: {
    position: "absolute",
    left: 80,
    top: 59,
    zIndex: 1,
  },
  card: {},
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
    marginTop: -20,
  },
  tabcontainer: {
    display: "flex",
    flexDirection: "row",
    width: 327,
    justifyContent: "space-between",
    backgroundColor: "#EFF7FF",
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    marginTop: 184,
  },
  way: {
    width: "50%",
    height: 60,
    paddingTop: 12,
    paddingLeft: 46,
    borderRadius: 24,
  },
  wayText: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "700",
    
  },
  line: {
    width: 28,
    height: 2.4,
    backgroundColor: "#72B6FF",
    marginLeft: 23,
    marginTop: 3,
    borderRadius: 1,
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
    paddingHorizontal: 16,
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
    color: "#A9D1FF",
  },
  agree: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
    paddingLeft: 10,
    gap: 8,
  },
  agreeIcon: {
    borderWidth: 1,
    height: 14,
    width: 14,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
});
