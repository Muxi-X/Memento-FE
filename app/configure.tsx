import { Link, useRouter, useFocusEffect } from "expo-router";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import Arrowback from "../assets/images/arrow-back.svg";
import ArrowRight from "../assets/images/arrow-auth.svg";
import { useSettingStore } from "./stores/authstore";
import { useEffect, useRef, useCallback } from "react";
import { getMeSetting, updateMeNotificationSettings, updatePublicable } from "./api/me";

export default function Configure() {
  // 状态获取
  const public_pool_enabled = useSettingStore((state) => state.public_pool_enabled);
  const setPublicPoolEnabled = useSettingStore((state) => state.setPublicPoolEnabled);
  const reaction_enabled = useSettingStore((state) => state.reaction_enabled);
  const setReactionEnabled = useSettingStore((state) => state.setReactionEnabled);
  const creation_reminder_enabled = useSettingStore((state) => state.creation_reminder_enabled);
  const setCreationReminderEnabled = useSettingStore((state) => state.setCreationReminderEnabled);

  const router = useRouter();
  const initialSettings = useRef({
    public_pool_enabled: false,
    reaction_enabled: false,
    creation_reminder_enabled: false,
  });

  const getSetting = useCallback(async () => {
    const res = await getMeSetting();
    const data = res.data;

    // 更新状态
  //   setPublicPoolEnabled(data.public_pool_enabled);
  //   setReactionEnabled(data.reaction_enabled);
  //   setCreationReminderEnabled(data.creation_reminder_enabled);
  //   initialSettings.current = {
  //     public_pool_enabled: data.public_pool_enabled,
  //     reaction_enabled: data.reaction_enabled,
  //     creation_reminder_enabled: data.creation_reminder_enabled,
  //   };
  // 
  }, 
  []
);

  useEffect(() => {
    getSetting();
  }, [getSetting]);


  useFocusEffect(
    useCallback(() => {
      return () => {
        const hasPublicChange = initialSettings.current.public_pool_enabled !== public_pool_enabled;
        const hasNotifyChange =
          initialSettings.current.reaction_enabled !== reaction_enabled ||
          initialSettings.current.creation_reminder_enabled !== creation_reminder_enabled;
        if (hasPublicChange) {
          updatePublicable(public_pool_enabled);
        }
        if (hasNotifyChange) {
          updateMeNotificationSettings(reaction_enabled, creation_reminder_enabled);
        }
      };
    }, [public_pool_enabled, reaction_enabled, creation_reminder_enabled])
  );

  // 退出登录
  const handleout = async () => {
    await SecureStore.deleteItemAsync("refresh_token");
    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("user_id");
    await SecureStore.deleteItemAsync("user_name");
    router.navigate("/signin");
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Arrowback style={styles.arrowback} />
          <Text style={styles.headertext}>设置</Text>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 24, width: "100%", backgroundColor: "#F9F9F9" }}>
        <Text style={styles.titletext}>账号</Text>
        <View style={[styles.kuang, { flexDirection: "row" }]}>
          <Text>个人资料</Text>
          <Pressable
            style={{ position: "absolute", top: 25, right: 22 }}
            onPress={() => router.navigate("/setAuthdata")}
          >
            <ArrowRight style={{ width: 5, height: 10 }} />
          </Pressable>
        </View>

        <Text style={styles.titletext}>隐私权限</Text>
        <View style={[styles.kuang, { flexDirection: "row", gap: 30 }]}>
          <Text>是否公开官方关键词下上传的照片</Text>
          <Pressable
            style={[
              styles.changebtn,
              public_pool_enabled && { backgroundColor: "#72B6FF", alignItems: "flex-end", paddingRight: 1 },
            ]}
            onPress={() => setPublicPoolEnabled(!public_pool_enabled)}
          >
            <View style={styles.circle} />
          </Pressable>
        </View>

        <Text style={styles.titletext}>通知设置</Text>
        <View style={styles.kuang}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.font}>互动通知</Text>
            <Pressable
              style={[
                styles.changebtn,
                reaction_enabled && { backgroundColor: "#72B6FF", alignItems: "flex-end", paddingRight: 1 },
              ]}
              onPress={() => setReactionEnabled(!reaction_enabled)}
            >
              <View style={styles.circle} />
            </Pressable>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.font}>创作提醒</Text>
            <Pressable
              style={[
                styles.changebtn,
                creation_reminder_enabled && { backgroundColor: "#72B6FF", alignItems: "flex-end", paddingRight: 1 },
              ]}
              onPress={() => setCreationReminderEnabled(!creation_reminder_enabled)}
            >
              <View style={styles.circle} />
            </Pressable>
          </View>
        </View>

        <Text style={styles.titletext}>关于</Text>
        <View style={styles.kuang}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.font}>用户协议</Text>
            <Text>点击查看</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.font}>隐私政策</Text>
            <Text>点击查看</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.font}>版本号</Text>
            <Text>xxxxxxxxxxxxx</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.font}>联系我们</Text>
            <Text>xxxxxxxxxx</Text>
          </View>
        </View>

        <Pressable
          style={[styles.kuang, { marginTop: 20, alignItems: "center" }]}
          onPress={handleout}
        >
          <Text>退出登录</Text>
        </Pressable>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    height: 44,
    width: "100%",
    marginTop: 44,
    alignItems: "center",
    position: "relative",
    backgroundColor: "#fff",
  },
  arrowback: {
    left: 26,
    position: "absolute",
  },
  headertext: {
    fontSize: 16,
    fontWeight: "500",
    position: "absolute",
    left: 164,
  },
  titletext: {
    color: "#999999",
    fontWeight: "400",
    marginBottom: 10,
    marginTop: 20,
    marginLeft: 11,
  },
  kuang: {
    width: "100%",
    backgroundColor: "#ffffff",
    flexDirection: "column",
    gap: 16,
    paddingHorizontal: 23,
    paddingVertical: 22,
    borderRadius: 20,
  },
  font: {
    color: "#333333",
    fontSize: 14,
  },
  changebtn: {
    height: 20,
    width: 42,
    backgroundColor: "#EEEEEE",
    borderRadius: 99,
    justifyContent: "center",
    paddingLeft: 1,
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },
});