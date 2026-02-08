import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Memento from "../../assets/images/memento.svg";
import { PhotoWay, TakePhotoWay } from "../../components/createWay_1";
import { Idea } from "@/components/Idea";
import { Link } from "expo-router";
import { PhotoObject } from "../api/interface";
export default function TabTwoScreen() {
  const [dailysentence, setDailysentence] = useState("很多快乐来不及命名,只被当作日常");
  const handlePhotosSelected = (photos:PhotoObject[]) => {
    console.log("父组件收到的照片列表:", photos);
    Alert.alert("成功", `共选中 ${photos.length} 张照片`);
  };

  const changesentence = () => {
    const randomIndex = Math.floor(Math.random() * dailysentenceku.length);
    setDailysentence(dailysentenceku[randomIndex]);
  };
  const dailysentenceku= [
    "很多快乐来不及命名,只被当作日常",
    "用微小的事物感知幸福",
    "好在时间是个很大的容器",
    "最喜欢翻着照片回忆当时的心情",
    "人生就是用来创造回忆的",
    "普通的一天，也在认真发生",
    "三分钟热度就会有三分钟收获",
    "焦虑也没关系，饼干焦焦的也很好吃",
  ];
  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.dateIconRow}>
        <Text style={styles.dateText}>2026/2/4</Text>
        <Idea></Idea>
      </View>

      <Pressable style={{ position: "absolute", top: 35, left: -19 }} onPress={changesentence}>
        <Memento width={234} height={234}></Memento>
      </Pressable>
      <View style={styles.talkkuang}>
        <Text style={styles.talktext}>{dailysentence}</Text>
      </View>

      <View style={styles.keyword}>
        <Text style={styles.keywordtext}>关键词</Text>
      </View>
      <View style={styles.ChooseWay}>
        <PhotoWay  onPhotosSelected={handlePhotosSelected}></PhotoWay>
        <TakePhotoWay></TakePhotoWay>
      </View>
      <View style={styles.todaydata}>
        <Text style={styles.todaytext}>今日</Text>
        <Text style={styles.statText}>已有xxx人参与今日创作</Text>
        <Link href={"/find"} asChild>
          <Text style={styles.linkText}>查看作品 &gt;</Text>
        </Link>
      </View>
      <View style={styles.todaydata}>
        <Text style={styles.todaytext}>昨天</Text>
        <Text style={styles.statText}>已有xxx人参与昨日创作</Text>
        <Link href={"/find"} asChild>
          <Text style={styles.linkText}>查看作品 &gt;</Text>
        </Link>
      </View>

    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  dateIconRow: {
    position: "absolute",
    top: 83,
    right: 39,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dateText: {
    fontSize: 14,
    fontFamily: "思源黑体",
    fontWeight: "500",
    color: "#666666",
  },
  talkkuang: {
    backgroundColor: "#CEE6FF",
    height: 56,
    width: 160,
    borderColor: "#72B6FF",
    borderRadius: 999,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    position: "absolute",
    top: 118,
    right: 33,
  },
  talktext: {
    fontSize: 12,
    fontFamily: "思源黑体",
    fontWeight: "500",
    color: "#72B6FF",
  },
  keyword: {
    width: 154,
    height: 70,
    marginTop: 369,//有问题
  },
  keywordtext: {
    fontSize: 48,
  },
  ChooseWay: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    gap: 11,
    marginTop: 145,
    marginBottom: 10,
  },
  todaydata: {
    position: "relative",
    height: 110,
    width: 327,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginHorizontal: 24,
    marginBottom: 20,
  },
  todaytext: {
    fontSize: 30,
    fontFamily: "思源黑体",
    fontWeight: "400",
    position: "absolute",
    top: 18,
    left: 23,
  },
  statText: {
    position: "absolute",
    fontSize: 12,
    color: "#8EB7E7",
    paddingRight: 106,
    bottom: 20,
    left: 22,
  },
  linkText: {
    position: "absolute",
    fontSize: 12,
    fontWeight: "400", //字重没有350
    color: "#666666",
    bottom: 20,
    right: 18,
  },
 
});