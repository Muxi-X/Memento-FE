import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons}  from "@expo/vector-icons";

const keywords = [
  "安静",
  "快乐",
  "思念",
  "孤独",
  "希望",
  "回忆",
];

const keywordColors = {
  安静: "#B7E0FE",
  快乐: "#CFE9DC",
  思念: "#FBEDCA",
  孤独: "#FFDCA4",
  希望: "#FEDEE1",
  回忆: "#B7E0FE",
};//后续颜色前五个一循环


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
      {activeTab === "keyword" ? (
        <ScrollView
          style={styles.cardList}
          showsVerticalScrollIndicator={false}
        >
          {keywords.map((keyword, index) => (
            <View
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
            >
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{keyword}</Text>
                <Pressable
                  style={styles.detailArrow}
                  onPress={() => {
                    console.log(`点击了关键词：${keyword}`);
                  }}
                >
                  <Ionicons name="arrow-forward" size={20} color="#666" />
                </Pressable>
              </View>
              <Text style={styles.cardSubtitle}>xxx张作品</Text>
            </View>
          ))}
          <View>
            <Text>已经浏览完全部创作过的关键词</Text>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.cardList}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardheader}>
            <View>
              <Text style={{ color: "#999", fontSize: 14 }}>累计参与</Text>
              <View style={styles.cardheaderdata}>
                <Text style={{ fontSize: 36 }}>XXX</Text>
                <Text style={{ fontSize: 16, color: "#999" }}>天</Text>
              </View>
            </View>
            <View>
              <Text style={{ color: "#999", fontSize: 14 }}>作品总数</Text>
              <View style={styles.cardheaderdata}>
                <Text style={{ fontSize: 36 }}>XXX</Text>
                <Text style={{ fontSize: 16, color: "#999" }}>张</Text>
              </View>
            </View>
          </View>
          {keywords.map((keyword, index) => (
            <View key={index} style={styles.carddate_Item}>
              <Text style={styles.cardkeyword}>{keyword}</Text>

              <Pressable style={[styles.detailArrowmore,styles.detailArrow]} onPress={()=>{
                console.log( `查看${keyword}详情`);
                
              }}>
                <Ionicons name="arrow-forward" size={20} color="#666" />
              </Pressable>
              <View style={styles.cardnumber}>
                <Text>xxx张作品</Text>
              </View>
              <Text style={styles.carddate}>20xx/x/xx</Text>
            </View>
          ))}
        </ScrollView>
      )}
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
    backgroundColor: " rgba(255, 255, 255, 0.5)",
  },
  cardSubtitle: {
    position: "absolute",
    top: 59,
    left: 28,
  },
  cardheader: {
    height: 100,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "space-evenly",
    gap: 56,
  },
  cardheaderdata: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-end",
  },
  carddate_Item: {
    position: "relative",
    height: 110,
    backgroundColor: "#fff",
    borderRadius: 20,
    flexDirection: "row",
    marginTop: 20,
    gap: 202,
    paddingTop:56,
    paddingLeft:26
  },
  carddate: {
    position: "absolute",
    top: 24,
    left: 26,
    fontSize: 14,
    color: "#666",
  },
  cardnumber: {
    position: "absolute",
    minWidth: 72,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    top: 24,
    right: 23,
    paddingHorizontal: 5,
    borderColor: "rgba(102, 102, 102, 0.5)",
    borderWidth: 1,
    borderRadius: 10,
  },
  cardkeyword: {
    fontSize: 24,
  },
  detailArrowmore:{
    borderWidth:1,
    borderColor:"#EFEFEF",
    borderRadius:10,
  }
});
