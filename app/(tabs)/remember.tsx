
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons"; // 用于右侧箭头图标

const keywords = [
  "安静",
  "快乐",
  "思念",
  "孤独",
  "希望",
  "回忆",
  "梦想",
  "成长",
  "自由",
  "爱恋",
];

const keywordColors = {
  安静: "#BEDCFF",
  快乐: "#FFE0B2",
  思念: "#F8BBD0",
  孤独: "#C8E6C9",
  希望: "#FFF9C4",
  回忆: "#D1C4E9",
  梦想: "#FFCCBC",
  成长: "#E0F7FA",
  自由: "#E8F5E9",
  爱恋: "#FCE4EC",
};

export default function FindScreen() {
  const [activeTab, setActiveTab] = useState("keyword");

  const handleChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headertitle}>
          <Text style={styles.title}>回顾</Text>
        </View>
        <View style={styles.changekuang}>
          <TouchableOpacity
            onPress={() => handleChange("keyword")}
            style={styles.tabItem}
          >
            <Text
              style={[
                styles.changetext,
                activeTab === "keyword" && styles.activeText,
              ]}
            >
              关键词
            </Text>
            <View
              style={[
                styles.tabLine,
                activeTab === "keyword" && styles.activeLine,
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleChange("date")}
            style={styles.tabItem}
          >
            <Text
              style={[
                styles.changetext,
                activeTab === "date" && styles.activeText,
              ]}
            >
              日期
            </Text>
            <View
              style={[
                styles.tabLine,
                activeTab === "date" && styles.activeLine,
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 关键词卡片列表区域 */}
      <ScrollView style={styles.cardList} showsVerticalScrollIndicator={false}>
        {keywords.map((keyword, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.cardItem,
              {
                backgroundColor:
                  keywordColors[keyword as keyof typeof keywordColors] ||
                  "#E0E0E0",
                marginTop: index > 0 ? -295 : 0,
                zIndex: keywords.length + index,
              },
            ]}
            onPress={() => {
              console.log(`点击了关键词：${keyword}`);
            }}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{keyword}</Text>
              <View style={styles.detailArrow}>
                <Ionicons name="arrow-forward" size={20} color="#666" />
              </View>
            </View>
            <Text style={styles.cardSubtitle}>5张作品</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    position: "relative",
  },
  header: {
    width: "100%",
    height: 128,
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  headertitle: {
    marginTop: 44,
    width: "100%",
    height: 44,
    paddingLeft: 26,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  changekuang: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 40,
    gap: 69,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  changetext: {
    fontSize: 16,
    fontWeight: 500,
    color: "#333",
  },
  activeText: {
    color: "#72B6FF",
  },
  tabLine: {
    width: 28,
    height: 2.5,
    borderRadius: 2.4,
    marginTop: 2,
    backgroundColor: "transparent",
  },
  activeLine: {
    backgroundColor: "#72B6FF",
  },
  cardList: {
    flex: 1,
    marginHorizontal: 24,
    marginTop: 20,
  },
  cardItem: {
    borderRadius: 30,
    height: 395,
    position: "relative",
  },
  cardContent: {
    flexDirection: "row",
    gap: 200,
    paddingLeft: 27,
    paddingTop: 16,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  detailArrow: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  cardSubtitle: {
    position: "absolute",
    top: 59,
    left: 28,
  },
});
