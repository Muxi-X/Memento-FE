import { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Pressable,
  Platform,
  StatusBar,
  LayoutAnimation, 
   UIManager
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Memento from "../../assets/images/memento.svg";
import { PhotoWay, TakePhotoWay } from "../../components/createWay_1";
import { Idea } from "@/components/Idea";
import { useRouter } from "expo-router";
import { getoffcialHome } from "../api/keywords";
import usePromptStore from "../stores/usePromptStore";
import TalkKuang from "../../assets/images/talkkuang.svg";
import * as SecureStore from "expo-secure-store";
import { GuideOverlay } from "../../components/guideOverlay";

const { width: screenWidth } = Dimensions.get("window");

export default function TabTwoScreen() {
  const router = useRouter();
  const [dailysentence, setDailysentence] = useState("很多快乐来不及命名,只被当作日常");
  const [keyWords_text, setKeyWords_text] = useState(" 关键词");
  const [participant_user_count, setParticipant_user_count] = useState(0);
  const [yesterday_user_count, setYesterday_user_count] = useState(0);

  const date = usePromptStore((state) => state.biz_date);
  const setDate = usePromptStore((state) => state.setdate);
  const setKeywordId = usePromptStore((state) => state.setKeywordId);
  const setBiz_date = usePromptStore((state) => state.setBiz_date);
  const setTodayKeyword = usePromptStore((state) => state.setTodayKeyword);
  const setYesterdaysKeyword = usePromptStore((state) => state.setYesterdaysKeyword);
  const setYesterdaydate = usePromptStore((state) => state.setYesterdaydate);
  const keywordRef = useRef<View>(null);
  const findRef = useRef<View>(null);
  const ideaRef = useRef<View>(null);
  const innerTipRef = useRef<View>(null); 
  const [step, setStep] = useState(0);
  const [targetLayout, setTargetLayout] = useState<any>(null);

  const steps = [null, keywordRef, findRef, ideaRef, innerTipRef];

  const startGuide = () => setStep(1);
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
  const nextStep = async () => {
    const next = step + 1;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (next === 4) {
    // 旧的step===3坐标会影响导致4跳一下
    setTargetLayout(null); 
  }
    if (next > 4) {
      setStep(0);
      await SecureStore.setItemAsync("has_guided_home", "true");
      return;
    }
    setStep(next);
  };

  // 测量位置
  useEffect(() => {
    if (step === 4 || step === 0) return;
    const ref = steps[step];
    if (!ref || !ref.current) return;
    ref.current?.measureInWindow((x, y, w, h) => {
          let finalY = y;
          // 安卓位置状态栏高度
        if (Platform.OS === "android") {
          finalY = y + (StatusBar.currentHeight || 0);
        }
      setTargetLayout({ x, y: finalY, w, h });
    });
  }, [step]);

  // 日期格式化
  const formatDate = (dateStr: string) => {
    if (!dateStr || !dateStr.includes("-")) return dateStr;
    const [year, month, day] = dateStr.split("-");
    return `${year}/${Number(month)}/${Number(day)}`;
  };

  const dailysentenceku = [
    "很多快乐来不及命名,只被当作日常",
    "用微小的事物感知幸福",
    "好在时间是个很大的容器",
    "最喜欢翻着照片回忆当时的心情",
    "人生就是用来创造回忆的",
    "普通的一天，也在认真发生",
    "三分钟热度就会有三分钟收获",
    "焦虑也没关系，饼干焦焦的也很好吃",
  ];

  const getRandomSentence = () => {
    const i = Math.floor(Math.random() * dailysentenceku.length);
    return dailysentenceku[i];
  };

  useEffect(() => {
    setDailysentence(getRandomSentence());
    const initPage = async () => {
      try {
        const res = await getoffcialHome();
        const { today, yesterday } = res.data;

        setKeyWords_text(today.keyword.text);
        setTodayKeyword(today.keyword.text);
        setDate(today.biz_date);
        setParticipant_user_count(today.participant_user_count);
        setYesterday_user_count(yesterday.participant_user_count);
        setKeywordId(today.keyword.id);
        setBiz_date(formatDate(today.biz_date));
        setYesterdaysKeyword(yesterday.keyword.text);
        setYesterdaydate(yesterday.biz_date);

        const hasGuided = await SecureStore.getItemAsync("has_guided_home");
        if (!hasGuided) {
          setTimeout(startGuide, 800);
        }
      } catch (err) {
        console.log(err);
      }
    };
    initPage();
  }, []);

  return (
    <>
      <ScrollView>
        <SafeAreaProvider style={styles.container}>
          <View style={styles.dateIconRow}>
            <Text style={styles.dateText}>{date}</Text>
            <View ref={ideaRef}>
              <Idea 
                isGuideMode={step === 4} 
                step={step} 
                onNext={nextStep} 
                innerRef={innerTipRef}
                targetLayout={targetLayout}
                setTargetLayout={setTargetLayout}
              />
            </View>
          </View>

          <View style={styles.mementoWrap}>
            <Memento width={234} height={234} />
          </View>

          <View style={styles.talkkuang}>
            <TalkKuang style={styles.talkIcon} />
            <Text style={styles.talktext}>{dailysentence}</Text>
          </View>

          <View style={styles.keyword} ref={keywordRef}>
            <Text style={styles.keywordtext}>{keyWords_text}</Text>
          </View>

          <View style={styles.ChooseWay}>
            <TakePhotoWay />
            <PhotoWay />
          </View>

          <View style={styles.todaydata}>
            <Text style={styles.todaytext}>今日</Text>
            <Text style={styles.statText}>
              已有{participant_user_count}人参与今日创作
            </Text>
            <Pressable
              ref={findRef}
              style={styles.linkText}
              onPress={() => router.navigate("/find")}
            >
              <Text style={styles.linkTxt}>查看作品 &gt;</Text>
            </Pressable>
          </View>

          <View style={styles.todaydata}>
            <Text style={styles.todaytext}>昨天</Text>
            <Text style={styles.statText}>
              已有{yesterday_user_count}人参与昨日创作
            </Text>
            <Pressable
              style={styles.linkText}
              onPress={() => router.navigate("/yesterdayfind")}
            >
              <Text style={styles.linkTxt}>查看作品 &gt;</Text>
            </Pressable>
          </View>
        </SafeAreaProvider>
      </ScrollView>

      {step > 0 && step < 4 && (
        <GuideOverlay
          visible={true}
          target={targetLayout}
          step={step}
          onNext={nextStep}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    position: "relative",
  },
  mementoWrap: {
    position: "absolute",
    top: 35,
    left: -19,
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
    fontWeight: "500",
    color: "#999",
    letterSpacing: 1,
  },
  talkkuang: {
    width: 160,
    height: 58.5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    position: "absolute",
    top: 118,
    right: 33,
  },
  talkIcon: {
    position: "absolute",
  },
  talktext: {
    fontSize: 12,
    fontWeight: "500",
    color: "#72B6FF",
    letterSpacing: 1,
    lineHeight: 15,
  },
  keyword: {
    height: 70,
    marginTop: 269,
    alignItems: "center",
    justifyContent: "center",
  },
  keywordtext: {
    fontSize: 48,
  },
  ChooseWay: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 145,
    marginBottom: 10,
    paddingHorizontal: 24,
  },
  todaydata: {
    position: "relative",
    height: 110,
    width: screenWidth - 48,
    backgroundColor: "#FFF",
    borderRadius: 20,
    marginBottom: 20,
  },
  todaytext: {
    fontSize: 30,
    fontWeight: "400",
    position: "absolute",
    top: 18,
    left: 23,
  },
  statText: {
    position: "absolute",
    fontSize: 14,
    color: "#999",
    paddingRight: 106,
    bottom: 20,
    left: 22,
  },
  linkText: {
    position: "absolute",
    bottom: 20,
    right: 18,
  },
  linkTxt: {
    fontSize: 12,
    fontWeight: "400",
    color: "#666",
  },
});
