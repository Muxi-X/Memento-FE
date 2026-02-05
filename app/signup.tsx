import { useEffect, useState, useRef } from "react"; // 新增useRef用于防抖定时器
import * as SecureStore from "expo-secure-store";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import Arrowleft from "../assets/images/arrow-left.svg";
import AgreeIcon from "../assets/images/agreeIcon.svg";
import Warning from "../assets/images/warning.svg";
import Pass from "../assets/images/pass.svg";
import { useNavigation } from "@react-navigation/native";
import Background from "@/components/background";
import { sendCode, verifyCode, signupComplete } from "./api/user";

export default function Signup() {
  const [verifyResult, setVerifyResult] = useState<React.ReactNode>(<Warning/>);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState(""); 
  const [verifypasswordResult, setVerifypasswordResult] = useState<React.ReactNode>(null); 
  const [countdown, setCountdown] = useState(0);
  const [sendCodeText, setSendCodeText] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  // 防抖定时器ref：用于密码比对的防抖，避免频繁触发
  const pwdDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const checkPwdEqual = () => {
    if (pwdDebounceTimer.current) {
      clearTimeout(pwdDebounceTimer.current);
    }
    pwdDebounceTimer.current = setTimeout(() => {
      if (password && confirmPwd) {
        if (password === confirmPwd) {
          setVerifypasswordResult(<Pass />); 
        } else {
          setVerifypasswordResult(<Warning />); 
        }
      } else {
        setVerifypasswordResult(<Warning></Warning>); 
      }
    }, 500); 
  };

  useEffect(() => {
    checkPwdEqual();
    return () => {
      if (pwdDebounceTimer.current) {
        clearTimeout(pwdDebounceTimer.current);
      }
    };
  }, [password, confirmPwd]); 


  const handleSendCode = async () => {
    if (!email) {
      alert("请输入邮箱地址");
      return;
    }
    try {
      const res = await sendCode(email);
      console.log(res);
      if (res.status === 204) {
        setCountdown(60);
        setIsDisabled(true);
        alert("验证码已发送，请注意查收邮箱");
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setIsDisabled(false);
              return 0;
            } else {
              return prev - 1;
            }
          });
        }, 1000); 
      } else {
        alert("发送验证码失败，请稍后重试");
        console.log("发送验证码失败:", res);
      }
    } catch (error) {
      console.error("发送验证码失败:", error);
      alert("发送验证码失败，请稍后重试");
    }
  };
  const handleRegister = async () => {
    if (!agreed) {
      alert("请阅读并同意《隐私协议》和《用户协议》");
      return;
    }
    if (!password || !confirmPwd) {
      alert("请完成密码和确认密码的输入");
      return;
    }
    if (password !== confirmPwd) {
      alert("两次输入的密码不一致，请重新输入");
      return;
    }
    const signup_token = await SecureStore.getItemAsync("signup_token");
    if (!signup_token) {
      alert("请先完成邮箱验证码验证");
      return;
    }
  
    try {
      const res = await signupComplete({ signup_token, password });

      console.log("注册结果", res);
      if (res.status === 200) {
        alert("注册成功");
        
        navigation.navigate("signin" as never);
      } else {
        alert("注册失败，请稍后重试");
      }
    } catch (error) {
      console.error("注册失败:", error);
      alert("注册失败，请稍后重试");
    }
  };
  const handleVerify = async () => {
    if (!email || sendCodeText.length !== 6) {
      setVerifyResult(null);
      return;
    }
    try {
      const res = await verifyCode({ email, code: sendCodeText });
      console.log("验证码校验结果",res);
      if (res.status === 200 && res.data.valid === true) {
        setVerifyResult(<Pass />);
        await SecureStore.setItemAsync("signup_token", res.data.signup_token);
      } else {
        setVerifyResult(<Warning />);
        alert("验证码错误");
      }
    } catch (err) {
      setVerifyResult(<Warning />);
      alert("验证码校验失败");
    }
  };
  useEffect(() => {
    if (sendCodeText.length === 6&&countdown !== 0) {
      handleVerify();
    } else {
      setVerifyResult(<Warning />);
    }
  }, [sendCodeText]);

  return (
    <Background>
      <View style={styles.forgetcard}>
        <Pressable
          style={styles.sendCodeText}
          onPress={handleSendCode}
          disabled={isDisabled}
        >
          <Text style={{ fontSize: 14, color: "#72B6FF" }}>
            {countdown > 0 ? `${countdown}秒后重发` : "获取验证码"}
          </Text>
        </Pressable>

        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Arrowleft width={5.5} height={12} />
          </Pressable>
          <Text style={{ fontSize: 16, fontWeight: 700 }}>用户注册</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.tiptext}>邮箱</Text>
          <TextInput
            style={styles.inputKuang}
            placeholder="请输入邮箱"
            onChangeText={(text) => setEmail(text)}
            value={email} 
          />
          <View style={{display:"flex",flexDirection:"row",alignItems:"center",gap:5}}>
            <Text style={styles.tiptext}>验证码</Text>
            <View>{verifyResult}</View>
          </View>
          <TextInput
            style={styles.inputKuang}
            placeholder="请输入验证码"
            onChangeText={(text) => setSendCodeText(text)}
            value={sendCodeText} 
            maxLength={6}
            keyboardType="numeric" 
          />          <Text style={styles.tiptext}>设置密码</Text>
          <TextInput
            style={styles.inputKuang}
            autoComplete="off"
            placeholder="请输入新密码"
            secureTextEntry
            onChangeText={(text) => setPassword(text)} 
            value={password} 
            autoCapitalize="none" 
            autoCorrect={false} 
          />
          <View style={{display:"flex",flexDirection:"row",alignItems:"center",gap:5}}>
            <Text style={styles.tiptext}>确认密码</Text>
            <View>{verifypasswordResult}</View> 
          </View>
          <TextInput
            style={styles.inputKuang}
            autoComplete="off"
            placeholder="请再次输入密码"
            secureTextEntry
            onChangeText={(text) => setConfirmPwd(text)} 
            value={confirmPwd} 
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <Pressable style={styles.loginBtn} onPress={handleRegister}>
          <Text style={styles.loginText}>立即注册</Text>
        </Pressable>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Pressable onPress={() => setAgreed(!agreed)}>
            {agreed ? (
              <AgreeIcon />
            ) : (
              <View
                style={{
                  borderColor: "#999999",
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  borderWidth: 1,
                }}
              ></View>
            )}
          </Pressable>
          <Text style={{ color: "#999999", fontSize: 12 }}>
            已阅读并同意《隐私协议》和《用户协议》
          </Text>
        </View>
      </View>
    </Background>
  );
}
const styles = StyleSheet.create({
  forgetcard: {
    backgroundColor: "#ffffff",
    width: 327,
    height: 500,
    borderRadius: 24,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    position: "relative",
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
  tiptext: {
    fontSize: 14,
    color: "#666666",
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
    marginBottom: 20,
  },
  loginText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  sendCodeText: {
    position: "absolute",
    top: 175,
    right: 34,
    zIndex: 1,
  },
});