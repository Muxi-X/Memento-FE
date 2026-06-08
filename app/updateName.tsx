import {
  View,
  StyleSheet,
  Pressable,
  Text,
  TextInput,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Arrowback from "../assets/images/arrow-back.svg";
import { useRouter,useNavigation } from "expo-router";
import {  useEffect, useState } from "react";
import { updateMeNickname } from "./api/me";
import { useMyStore } from "./stores/authstore";
export default function UpdateName() {
  const [name, setName] = useState("");
  const setNickname = useMyStore((state) => state.setNickname);
  const router = useRouter();
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const updateMyname = async () => {
    try {
      const res = await updateMeNickname(name);
      setNickname(res.data.nickname);
      router.replace("/configure");
    } catch (error) {
      console.error("请求失败：", error);
      if ((error as any).code === "ECONNABORTED") {
        alert("请求超时，请检查网络或稍后重试");
      } else {
        alert("加载失败，请稍后重试");
      }
    }
  };
  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            router.back();
          }}
        >
          <Arrowback />
        </Pressable>
        <Text style={styles.headertext}>编辑昵称</Text>
        <Pressable style={[styles.button,name.length>0||name.length>20?{backgroundColor:"#72B6FF"}:{backgroundColor:"#EFEFEF"}]} 
          disabled={name.length<1||name.length>20} onPress={updateMyname}>
          <Text style={[{ fontSize: 14 },name.length>0||name.length>20?{color:"#FFFFFF"}:{color:"#CCCCCC"}]}>确定</Text>
        </Pressable>
      </View>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          width: "100%",
          backgroundColor: "#F9F9F9",
        }}
      >
        <View style={styles.body}>
          <View style={styles.kuang}>
            <TextInput
              placeholder="请输入昵称"
              value={name}
              onChangeText={(text) => setName(text)}
            ></TextInput>
            <Text style={{ color: "#CCCCCC", fontSize: 14 }}>
                {`${name.length}/20`}
            </Text>
          </View>
          <Text style={[styles.text, { marginTop: 11,marginLeft:23 }]}>请设置1-20个字符</Text>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    height: 44,
    width: "100%",
    marginTop: 44,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 26,
  },

  headertext: {
    fontSize: 16,
    fontWeight: 500,
    marginLeft:16
  },
  button: {
    width: 48,
    height: 27,
    backgroundColor: "#EFEFEF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
  },
  body: {
 
  },
  kuang: {
       width: 327,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    marginTop: 30,
    paddingHorizontal: 23,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 14,
    color: "#666666",
    marginRight: 36,
  },
});
