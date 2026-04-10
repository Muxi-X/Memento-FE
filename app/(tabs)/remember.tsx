import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ReviewDatesResponse, ReviewkeywordItem } from "../api/interface";
import { listReviewDates, listReviewKeywords } from "../api/review";

const keywordColors = [
  "#B7E0FE",
  "#CFE9DC",
  "#FBEDCA",
  "#FFDCA4",
  "#FEDEE1",
  "#B7E0FE",
];

export default function FindScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const [activeTab, setActiveTab] = useState("keyword");
  const [reviewData, setReviewData] = useState<ReviewDatesResponse>();
  const [keywordData, setKeywordData] = useState<ReviewkeywordItem[]>([]);

  const handleChange = (tab: string) => {
    setActiveTab(tab);
  };
  const formatDate = (dateStr: string) => {
    if (!dateStr || !dateStr.includes("-")) {
      return dateStr;
    }
    const [year, month, day] = dateStr.split("-");
    const formattedMonth = Number(month).toString();
    const formattedDay = Number(day).toString();
    return `${year}/${formattedMonth}/${formattedDay}`;
  };
  const getReviewdateList = async () => {
    try {
      const token = await SecureStore.getItemAsync("access_token");
      console.log(token);
      if (token !== null) {
        const res = await listReviewDates();
        setReviewData(res.data);
      } else {
        router.navigate("/signin");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getReviewKeywordList = async () => {
    try {
      const token = await SecureStore.getItemAsync("access_token");
      console.log(token);
      if (token !== null) {
        const res = await listReviewKeywords();
        setKeywordData(res.data.items);
        console.log(res.data.items);
      } else {
        router.navigate("/signin");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReviewdateList();
    getReviewKeywordList();
  }, []);
  const onRefresh = async () => {
    setRefreshing(true);
    await getReviewdateList();
    setRefreshing(false);
  };
  if (reviewData === null || keywordData === null) {
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
      </SafeAreaProvider>
    );
  }
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#72B6FF"]}
              tintColor="#72B6FF"
              title="正在刷新..."
              titleColor="#999"
            />
          }
        >
          {keywordData.map((item, index) => (
            <View
              key={index}
              style={[
                styles.cardItem,
                {
                  backgroundColor: keywordColors[index % 5] || "#E0E0E0",
                  marginTop: index > 0 ? -44 : 0,
                  zIndex: keywordData.length + index,
                },
              ]}
            >
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.keyword.text}</Text>
                <Pressable
                  style={styles.detailArrowmore}
                  onPress={() => {
                    router.navigate({
                      pathname: "/reviewFind/keywordsClass",
                      params: {
                        keyword_id: item.keyword.id,
                        keywordtext: item.keyword.text,
                      },
                    });
                  }}
                >
                  <Ionicons name="arrow-forward" size={20} color="#666" />
                </Pressable>
              </View>
              <View style={styles.cardSubtitle}>
                <Text style={{ color: "#999", fontSize: 12 }}>
                  {item.my_upload_count}张作品
                </Text>
              </View>
            </View>
          ))}
          <View
            style={{
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>已经浏览完全部创作过的关键词</Text>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.cardList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#72B6FF"]}
              tintColor="#72B6FF"
              title="正在刷新..."
              titleColor="#999"
            />
          }
        >
          <View style={styles.cardheader}>
            <View>
              <Text style={{ color: "#999", fontSize: 14 }}>累计参与</Text>
              <View style={styles.cardheaderdata}>
                <Text style={{ fontSize: 36 }}>
                  {reviewData?.total_participation_days}
                </Text>
                <Text style={{ fontSize: 16, color: "#999" }}>天</Text>
              </View>
            </View>
            <View>
              <Text style={{ color: "#999", fontSize: 14 }}>作品总数</Text>
              <View style={styles.cardheaderdata}>
                <Text style={{ fontSize: 36 }}>
                  {reviewData?.total_image_count}
                </Text>
                <Text style={{ fontSize: 16, color: "#999" }}>张</Text>
              </View>
            </View>
          </View>
          {reviewData?.items.map((item, index) => (
            <View key={index} style={styles.carddate_Item}>
              <Text style={styles.cardkeyword}>{item.keyword.text}</Text>

              <Pressable
                style={[styles.detailArrowmore, { top: 62 }]}
                onPress={() => {
                  router.navigate({
                    pathname: "/reviewFind/dateClass",
                    params: {
                      biz_date: item.biz_date,
                      keywordtext: item.keyword.text,
                    },
                  });
                }}
              >
                <Ionicons name="arrow-forward" size={20} color="#666" />
              </Pressable>
              <View style={styles.cardnumber}>
                <Text style={{ color: "#666", fontSize: 12 }}>
                  {item.my_image_count === null ? "0" : item.my_image_count}
                  张作品
                </Text>
              </View>
              <Text style={styles.carddate}>{formatDate(item.biz_date)}</Text>
            </View>
          ))}
          <View
            style={{
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>已经回到最早的一天</Text>
          </View>
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
    height: 144,
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
    fontWeight: 500,
    color: "#666666",
  },
  cardSubtitle: {
    position: "absolute",
    top: 59,
    left: 28,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 72,
    paddingHorizontal: 12,
    height: 22,
    borderRadius: 10,
    borderColor: " rgba(102, 102, 102, 0.5)",
    borderWidth: 1,
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
    justifyContent: "flex-start",
    height: 52,
  },
  carddate_Item: {
    position: "relative",
    height: 110,
    backgroundColor: "#fff",
    borderRadius: 20,
    flexDirection: "row",
    marginTop: 20,
    paddingTop: 56,
    paddingLeft: 26,
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
    top: 24,
    right: 23,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    borderColor: "rgba(102, 102, 102, 0.5)",
    borderWidth: 1,
    borderRadius: 999,
  },
  cardkeyword: {
    fontSize: 24,
  },
  detailArrowmore: {
    position: "absolute",
    top: 18,
    right: 27.28,
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EFEFEF",
  },
});
