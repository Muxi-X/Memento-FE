import { useEffect, useState } from "react";
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
import { getKeywords, getoffcialHome } from "../api/keywords";
import usePromptStore from "../stores/usePromptStore";
export default function TabTwoScreen() {
  const [dailysentence, setDailysentence] = useState("很多快乐来不及命名,只被当作日常");
  const [keyWords_text, setKeyWords_text] = useState(" 关键词");
  const [participant_user_count, setParticipant_user_count] = useState(0);
  const[yesterday_user_count, setYesterday_user_count ]= useState(0);
  const date=usePromptStore((state)=>state.biz_date)
  const setDate=usePromptStore((state)=>state.setdate)
  const setKeywordId=usePromptStore((state)=>state.setKeywordId)
  const setBiz_date=usePromptStore((state)=>state.setBiz_date)
  const setTodayKeyword=usePromptStore((state)=>state.setTodayKeyword)
  const setYesterdaysKeyword=usePromptStore((state)=>state.setYesterdaysKeyword)
  const setYesterdaydate=usePromptStore((state)=>state.setYesterdaydate)
  const handlePhotosSelected = (photos:PhotoObject[]) => {
    console.log("父组件收到的照片列表:", photos);
    Alert.alert("成功", `共选中 ${photos.length} 张照片`);
  };
  const formatDate = (dateStr: string) => {
  if (!dateStr || !dateStr.includes('-')) {
    return dateStr;
  }
  const [year, month, day] = dateStr.split('-');  const formattedMonth = Number(month).toString();
  const formattedDay = Number(day).toString();
  return `${year}/${formattedMonth}/${formattedDay}`;
};
  
  useEffect((()=>{
    const fetchKeyWords= async()=>{
    try{
      const response = await getoffcialHome();
      const data = response.data;
      const today=data.today;
      const yesterday=data.yesterday;
      setKeyWords_text(today.keyword.text);
      setTodayKeyword(today.keyword.text)
      setDate(today.biz_date)
      setParticipant_user_count(today.participant_user_count)
      setYesterday_user_count(yesterday.participant_user_count)
      setKeywordId(today.keyword.id)
      setBiz_date(formatDate(today.biz_date))
      setYesterdaysKeyword(yesterday.keyword.text)
      setYesterdaydate(yesterday.biz_date)
    }catch(error){
      console.log(error,"oooooo");
      Alert.alert("错误", "获取关键词失败");
    }
  }
  fetchKeyWords();

  }), []);
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
    <ScrollView >
      <SafeAreaProvider style={styles.container}>
      <View style={styles.dateIconRow}>
        <Text style={styles.dateText}>{date}</Text>
        <Idea></Idea>
      </View>

      <Pressable style={{ position: "absolute", top: 35, left: -19 }} onPress={changesentence}>
        <Memento width={234} height={234}></Memento>
      </Pressable>
      <View style={styles.talkkuang}>
        <Text style={styles.talktext}>{dailysentence}</Text>

      </View>

      <View style={styles.keyword}>
        <Text style={styles.keywordtext}>{keyWords_text}</Text>
      </View>
      <View style={styles.ChooseWay}>
        <TakePhotoWay></TakePhotoWay>
        <PhotoWay  onPhotosSelected={handlePhotosSelected}></PhotoWay>
        
      </View>
      <View style={styles.todaydata}>
        <Text style={styles.todaytext}>今日</Text>
        <Text style={styles.statText}>已有{participant_user_count}人参与今日创作</Text>
        <Link href={"/find"} asChild>
          <Text style={styles.linkText}>查看作品 &gt;</Text>
        </Link>
      </View>
      <View style={styles.todaydata}>
        <Text style={styles.todaytext}>昨天</Text>
        <Text style={styles.statText}>已有{yesterday_user_count}人参与昨日创作</Text>
        <Link href={"/find"} asChild>
          <Text style={styles.linkText}>查看作品 &gt;</Text>      
        </Link>
      </View>
      
</SafeAreaProvider>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#F5F5F5",
    alignItems: "center",
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
    color: "#999999",
    letterSpacing:1,
  },
  talkkuang: {
    backgroundColor: "#EFF7FF",
    height: 56,
    width: 160,
    borderColor: "#72B6FF",
    borderRadius: 999,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    position: "absolute",
    top: 118,
    right: 33,
  },
  talktext: {
    fontSize: 12,
    fontFamily: "思源黑体",
    fontWeight: "500",
    color: "#72B6FF",
    letterSpacing:1,
    lineHeight: 15,
  },
  keyword: {
    width: 154,
    height: 70,
    marginTop: 269,//有问题
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: 14,
    color: "#999999",
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
