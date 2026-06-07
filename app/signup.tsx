import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  Alert,
} from "react-native";
import AgreeIcon from "../assets/images/agreeIcon.svg";
import Arrowleft from "../assets/images/arrow-leftsign.svg";
import Pass from "../assets/images/pass.svg";
import Warning from "../assets/images/warning.svg";
import Mmeyes from "../assets/images/Mmeyes.svg";
import { LinearGradient } from "expo-linear-gradient";
import { sendCode, signupComplete, verifyCode } from "./api/user";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Signup() {
  const navigation = useNavigation();

  // --- 状态管理 ---
  const [email, setEmail] = useState("");
  const [sendCodeText, setSendCodeText] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  
  const [verifyResult, setVerifyResult] = useState<React.ReactNode>(<Warning/>);
  const [verifypasswordResult, setVerifypasswordResult] = useState<React.ReactNode>(<Warning/>);
  
  const [countdown, setCountdown] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // --- 引用管理 ---
  const pwdDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const countdownTimer = useRef<NodeJS.Timeout | null>(null);
  const lastVerifiedCode = useRef(""); // 记录上次验证成功的代码，避免重复请求

  useEffect(()=>{
   navigation.setOptions({
      headerShown: false,
    });
  },[])
  // 密码实时比对逻辑
  useEffect(() => {
    if (pwdDebounceTimer.current) clearTimeout(pwdDebounceTimer.current);
    
    pwdDebounceTimer.current = setTimeout(() => {
      if (password && confirmPwd) {
        setVerifypasswordResult(password === confirmPwd ? <Pass /> : <Warning />);
      } else {
        setVerifypasswordResult(<Warning/>);
      }
    }, 500);

    return () => {
      if (pwdDebounceTimer.current) clearTimeout(pwdDebounceTimer.current);
    };
  }, [password, confirmPwd]);

  //  验证码校验 (独立于倒计时)
  const handleVerify = async (code: string) => {
    if (!email || code.length !== 6) return;
    if (code === lastVerifiedCode.current) return; // 已验证过则跳过

    try {
      const res = await verifyCode({ email, code });
      if (res.status === 200 && res.data.valid === true) {
        setVerifyResult(<Pass />);
        lastVerifiedCode.current = code; 
        await SecureStore.setItemAsync("signup_token", res.data.signup_token);
      } else {
        setVerifyResult(<Warning />);
      }
    } catch (err) {
      setVerifyResult(<Warning />);
    }
  };

  useEffect(() => {
    if (sendCodeText.length === 6) {
      handleVerify(sendCodeText);
    } else {
      setVerifyResult(<Warning/>); 
    }
  }, [sendCodeText]);

  // 发送验证码
  const handleSendCode = async () => {
    if (!email || !email.includes("@")) {
      Alert.alert("提示", "请输入有效的邮箱地址");
      return;
    }
    try {
      setIsDisabled(true);
      const res = await sendCode(email);
      if (res.status === 204) {
        setCountdown(60);
        if (countdownTimer.current) clearInterval(countdownTimer.current);
        countdownTimer.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownTimer.current!);
              setIsDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setIsDisabled(false);
        Alert.alert("错误", "发送失败，请检查邮箱是否正确");
      }
    } catch (error) {
      setIsDisabled(false);
      console.error(error);
    }
  };

  // 注册提交
  const handleRegister = async () => {
    if (!agreed) return Alert.alert("提示", "请阅读并同意协议");
    if (password.length < 8) return Alert.alert("提示", "密码长度需 ≥8 位");
    if (password !== confirmPwd) return Alert.alert("提示", "两次密码不一致");

    const signup_token = await SecureStore.getItemAsync("signup_token");
    if (!signup_token) return Alert.alert("提示", "请先完成验证码校验");

    try {
      const res = await signupComplete({ signup_token, password });
      if (res.status === 200) {
        if (res.data.access_token) {
          await SecureStore.setItemAsync("access_token", res.data.access_token);
          navigation.navigate("index" as never);
        } else {
          navigation.navigate("signin" as never);
        }
      }
    } catch (error) {
      Alert.alert("注册失败", "请稍后重试");
    }
  };

  // 页面销毁清理
  useEffect(() => {
    return () => {
      if (pwdDebounceTimer.current) clearTimeout(pwdDebounceTimer.current);
      if (countdownTimer.current) clearInterval(countdownTimer.current);
    };
  }, []);

  return (
    <LinearGradient
      colors={["#BCDBFF", "#EFF7FF", "#FFFFFF"]}
      locations={[0, 0.48, 1]}
      style={styles.gradientBackground}
    >
      <Mmeyes style={styles.eyeIcon} />
      
      <View style={styles.signupcard}>
        {/* 头部 */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Arrowleft />
          </Pressable>
          <Text style={styles.headerTitle}>用户注册</Text>
        </View>

        <View style={styles.body}>
          {/* 邮箱 */}
          <Text style={styles.tiptext}>邮箱</Text>
          <TextInput
            style={styles.inputKuang}
            placeholder="请输入邮箱"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* 验证码 */}
          <View style={styles.labelRow}>
            <Text style={styles.tiptext}>验证码</Text>
            {verifyResult}
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.inputKuang, { flex: 1 }]}
              placeholder="请输入验证码"
              onChangeText={setSendCodeText}
              value={sendCodeText}
              maxLength={6}
              keyboardType="numeric"
            />
            <Pressable 
              onPress={handleSendCode} 
              disabled={isDisabled}
              style={styles.innerSendBtn}
            >
              <Text style={{ fontSize: 13, color: isDisabled ? "#999" : "#72B6FF" }}>
                {countdown > 0 ? `${countdown}s` : "获取验证码"}
              </Text>
            </Pressable>
          </View>

          {/* 密码 */}
          <Text style={styles.tiptext}>设置密码 (≥8位)</Text>
          <TextInput
            style={styles.inputKuang}
            placeholder="请输入新密码"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
            autoCapitalize="none"
          />

          {/* 确认密码 */}
          <View style={styles.labelRow}>
            <Text style={styles.tiptext}>确认密码</Text>
            {verifypasswordResult}
          </View>
          <TextInput
            style={styles.inputKuang}
            placeholder="请再次输入密码"
            secureTextEntry
            onChangeText={setConfirmPwd}
            value={confirmPwd}
            autoCapitalize="none"
          />
        </View>

        {/* 提交按钮 */}
        <Pressable 
          style={[styles.loginBtn, !agreed && { opacity: 0.7 }]} 
          onPress={handleRegister}
        >
          <Text style={styles.loginText}>立即注册</Text>
        </Pressable>

        {/* 协议 */}
        <View style={styles.agreementRow}>
          <Pressable onPress={() => setAgreed(!agreed)}>
            {agreed ? <AgreeIcon /> : <View style={styles.unCheck} />}
          </Pressable>
          <Text style={styles.grayText}>已阅读并同意</Text>
          <Pressable onPress={() => navigation.navigate("privacyAgreement" as never)}>
            <Text style={styles.blueText}>《隐私协议》</Text>
          </Pressable>
          <Text style={styles.grayText}>和</Text>
          <Pressable onPress={() => navigation.navigate("userAgreement" as never)}>
            <Text style={styles.blueText}>《用户协议》</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    alignItems: "center",
  },
  eyeIcon: {
    zIndex: 1,
    position: "absolute",
    top: 59,
  },
  signupcard: {
    backgroundColor: "#ffffff",
    width: screenWidth - 48,
    borderRadius: 24,
    padding: 20,
    marginTop: 184,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  backBtn: {
    position: "absolute",
    left: 0,
    padding: 5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  body: {
    marginVertical: 10,
    gap: 8,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  innerSendBtn: {
    position: "absolute",
    right: 15,
  },
  tiptext: {
    marginLeft: 7,
    fontSize: 13,
    color: "#666666",
  },
  inputKuang: {
    backgroundColor: "#EEEEEE",
    height: 47,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  loginBtn: {
    backgroundColor: "#72B6FF",
    height: 47,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  loginText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  agreementRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  unCheck: {
    borderColor: "#999999",
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
  },
  grayText: { color: "#999999", fontSize: 11 },
  blueText: { color: "#72B6FF", fontSize: 11 },
});