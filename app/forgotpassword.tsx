import Arrowleft from '@/assets/images/arrow-left.svg';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, Dimensions, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import Mmeyes from '../assets/images/Mmeyes.svg';
import Pass from '../assets/images/pass.svg';
import Warning from '../assets/images/warning.svg';
import { resetSendcode, verifyResetEmailCode, resetComplete } from './api/user';
const { width: screenWidth } = Dimensions.get('window');
export default function Signup() {
  const navigation = useNavigation();

  // --- 状态管理 ---
  const [email, setEmail] = useState('');
  const [sendCodeText, setSendCodeText] = useState('');
  const [new_password, setNew_password] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  const [verifyResult, setVerifyResult] = useState<React.ReactNode>(<Warning />);
  const [verifypasswordResult, setVerifypasswordResult] = useState<React.ReactNode>(<Warning />);

  const [countdown, setCountdown] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  // --- 引用管理 ---
  const pwdDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const countdownTimer = useRef<NodeJS.Timeout | null>(null);
  const lastVerifiedCode = useRef(''); // 记录上次验证成功的代码，避免重复请求

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  // 密码实时比对逻辑
  useEffect(() => {
    if (pwdDebounceTimer.current) clearTimeout(pwdDebounceTimer.current);

    pwdDebounceTimer.current = setTimeout(() => {
      if (new_password && confirmPwd) {
        setVerifypasswordResult(new_password === confirmPwd ? <Pass /> : <Warning />);
      } else {
        setVerifypasswordResult(<Warning />);
      }
    }, 500);

    return () => {
      if (pwdDebounceTimer.current) clearTimeout(pwdDebounceTimer.current);
    };
  }, [new_password, confirmPwd]);

  //  验证码校验 (独立于倒计时)
  const handleVerify = useCallback(
    async (code: string) => {
      if (!email || code.length !== 6) return;
      if (code === lastVerifiedCode.current) return; // 已验证过则跳过

      try {
        const res = await verifyResetEmailCode(email, code);
        if (res.status === 200 && res.data.valid === true) {
          setVerifyResult(<Pass />);
          lastVerifiedCode.current = code;
          await SecureStore.setItemAsync('reset_token', res.data.reset_token);
        } else {
          setVerifyResult(<Warning />);
        }
      } catch {
        setVerifyResult(<Warning />);
      }
    },
    [email],
  );

  useEffect(() => {
    if (sendCodeText.length === 6) {
      handleVerify(sendCodeText);
    } else {
      setVerifyResult(<Warning />);
    }
  }, [handleVerify, sendCodeText]);

  // 发送验证码
  const handleSendCode = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('提示', '请输入有效的邮箱地址');
      return;
    }
    try {
      setIsDisabled(true);
      const res = await resetSendcode(email);
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
        Alert.alert('错误', '发送失败，请检查邮箱是否正确');
      }
    } catch (error) {
      setIsDisabled(false);
      console.error(error);
    }
  };

  // 注册提交
  const handleRegister = async () => {
    if (new_password.length < 8) return Alert.alert('提示', '密码长度需 ≥8 位');
    if (new_password !== confirmPwd) return Alert.alert('提示', '两次密码不一致');

    const reset_token = await SecureStore.getItemAsync('signup_token');
    if (!reset_token) return Alert.alert('提示', '请先完成验证码校验');

    try {
      const res = await resetComplete({ reset_token, new_password });
      if (res.status === 200) {
        if (res.data.access_token) {
          await SecureStore.setItemAsync('access_token', res.data.access_token);
          navigation.navigate('index' as never);
        } else {
          navigation.navigate('signin' as never);
        }
      }
    } catch {
      Alert.alert('注册失败', '请稍后重试');
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
      colors={['#BCDBFF', '#EFF7FF', '#FFFFFF']}
      locations={[0, 0.48, 1]}
      style={styles.gradientBackground}
    >
      <Mmeyes style={styles.eyeIcon} />

      <View style={styles.forgetcard}>
        {/* 头部 */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Arrowleft />
          </Pressable>
          <Text style={styles.headerTitle}>找回密码</Text>
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
            <Pressable onPress={handleSendCode} disabled={isDisabled} style={styles.innerSendBtn}>
              <Text style={{ fontSize: 13, color: isDisabled ? '#999' : '#72B6FF' }}>
                {countdown > 0 ? `${countdown}s` : '获取验证码'}
              </Text>
            </Pressable>
          </View>

          {/* 密码 */}
          <Text style={styles.tiptext}>设置密码 (≥8位)</Text>
          <TextInput
            style={styles.inputKuang}
            placeholder="请输入新密码"
            secureTextEntry
            onChangeText={setNew_password}
            value={new_password}
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
        <Pressable style={styles.loginBtn} onPress={handleRegister}>
          <Text style={styles.loginText}>立即注册</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}
// const styles = StyleSheet.create({
//   gradientBackground: {
//     flex: 1,
//     width: "100%",
//     alignItems: "center",
//   },
//   content: {
//     flex: 1,
//     position: "relative",
//   },

//   forgetcard: {
//     backgroundColor: "#ffffff",
//     width: screenWidth - 48,
//     height: screenHeight * (500 / 812),
//     borderRadius: 24,
//     padding: 20,
//     display: "flex",
//     flexDirection: "column",
//     position: "relative",
//     marginTop: 184,
//   },
//   header: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   body: {
//     marginVertical: 20,
//     display: "flex",
//     flexDirection: "column",
//     gap: 7,
//   },
//   tiptext: {
//     marginLeft: 7,
//     fontSize: 14,
//     color: "#666666",
//   },
//   inputKuang: {
//     backgroundColor: "#EEEEEE",
//     height: 47,
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     fontSize: 14,
//   },
//   loginBtn: {
//     backgroundColor: "#72B6FF",
//     height: 47,
//     borderRadius: 20,
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 20,
//   },
//   loginText: {
//     color: "#ffffff",
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   sendCodeText: {
//     position: "absolute",
//     top: 177,
//     right: 33,
//     zIndex: 1,
//   },
// });

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    alignItems: 'center',
  },
  eyeIcon: {
    zIndex: 1,
    position: 'absolute',
    top: 59,
  },
  forgetcard: {
    backgroundColor: '#ffffff',
    width: screenWidth - 48,
    borderRadius: 24,
    padding: 20,
    marginTop: 184,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  backBtn: {
    position: 'absolute',
    left: 0,
    padding: 5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  body: {
    marginVertical: 10,
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  innerSendBtn: {
    position: 'absolute',
    right: 15,
  },
  tiptext: {
    marginLeft: 7,
    fontSize: 13,
    color: '#666666',
  },
  inputKuang: {
    backgroundColor: '#EEEEEE',
    height: 47,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  loginBtn: {
    backgroundColor: '#72B6FF',
    height: 47,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  loginText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
