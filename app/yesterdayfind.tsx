import React, { useState, useLayoutEffect, useEffect } from "react";
import { useNavigation } from "expo-router";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  Dimensions,
  RefreshControl,
} from "react-native";
import { PostCard } from "@/components/postcard";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Arrowback from "../assets/images/arrow-back.svg";
import ChangeButton from "@/components/changebutton";
import usePromptStore, { useFindStore } from "./stores/usePromptStore";
import { listOfficialDateUploads } from "./api/keywords";
import Post from "./api/interface";
const { width: screenWidth } = Dimensions.get("window");

export default function KeywordYesterdayScreen() {
  const sort = useFindStore((state) => state.sort);
  const yesterdaysdate = usePromptStore((state) => state.yesterdaysdate);
  const [item, setItem] = useState<Post[]>([]);
  // 新增：刷新状态管理
  const [refreshing, setRefreshing] = useState(false);

  const getPublicList = async () => {
    try {
      const res = await listOfficialDateUploads(yesterdaysdate, sort);
      setItem(res.data.items);
      console.log(res.data.items);
    } catch (error) {
      console.error("获取数据失败：", error);
    }
  };

  useEffect(() => {
    getPublicList();
  }, [sort, yesterdaysdate]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getPublicList();
    setRefreshing(false);
  };

  const keyword = usePromptStore((state) => state.yesterdaysKeyword);
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {/* 头部导航栏 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>昨日关键词</Text>
          <Text style={styles.keywordText}>{keyword}</Text>
          <Pressable style={styles.buttonGroup} onPress={handleGoBack}>
            <Arrowback></Arrowback>
          </Pressable>
          <Pressable style={styles.changebutton}>
            <ChangeButton></ChangeButton>
          </Pressable>
        </View>
        <FlatList
          data={item}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostCard post={item} />}
          style={styles.postList}
          showsVerticalScrollIndicator={true}
          
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
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: 179,
    position: "relative",
    paddingTop: 59,
    gap: 11,
  },
  buttonGroup: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    left: 24,
    top: 56,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#999999",
  },
  keywordText: {
    fontSize: 36,
    fontWeight: "400",
    color: "#333",
    marginBottom: 8,
  },
  keywordEnglish: {
    fontSize: 16,
    fontWeight: "400",
    color: "#666666",
    marginBottom: 16,
  },
  changebutton: {
    position: "absolute",
    top: 134,
    right: 24,
  },
  postList: {
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  postCard: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  postImage: {
    width: screenWidth - 32,
    height: 240,
    resizeMode: "cover",
  },
  imageIndicatorContainer: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
  },
  imageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  activeIndicator: {
    backgroundColor: "#FFFFFF",
  },
  avatarButton: {
    position: "absolute",
    right: 12,
    bottom: 60,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  postCaption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#333",
  },
  interactionRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 16,
  },
  interactionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  interactionText: {
    fontSize: 12,
    color: "#999",
  },
});
