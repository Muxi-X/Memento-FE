import React, { useState, useLayoutEffect, useEffect } from "react";
import { useNavigation, useLocalSearchParams } from "expo-router";
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
import Arrowback from "../../assets/images/arrow-back.svg";
import  { ChangeButton2 } from "@/components/changebutton";
import usePromptStore, { useFindStore } from "../stores/usePromptStore";
import { listReviewKeywordsDetail } from "../api/review";
import Post from "../api/interface";
const { width: screenWidth } = Dimensions.get("window");
export default function KeywordScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const sort = useFindStore((state) => state.sort);
  const params = useLocalSearchParams();

  const keyword_id = (() => {
    if (Array.isArray(params.keyword_id)) return params.keyword_id[0] || "";
    return params.keyword_id || "";
  })();
  const [item, setItem] = useState<Post[]>([]);
  const getPublicList = async () => {
    const res = await listReviewKeywordsDetail(keyword_id);
    setItem(res.data.items);
    console.log(res.data.items);
  };
  useEffect(() => {
    getPublicList();
  }, [sort, keyword_id]);
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await getPublicList();
    setRefreshing(false);
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
          <Text style={styles.keywordText}>{params.keywordtext}</Text>
          <Pressable style={styles.buttonGroup} onPress={handleGoBack}>
            <Arrowback></Arrowback>
          </Pressable>
          <Pressable style={styles.changebutton}>
            <ChangeButton2></ChangeButton2>
          </Pressable>
        </View>
        <FlatList
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
          data={item}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostCard post={item} />}
          style={styles.postList}
          showsVerticalScrollIndicator={true}
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
    justifyContent: "center",
    width: "100%",
    height: 179,
    backgroundColor: "#FBFBFD00",
    position: "relative",
    paddingTop: 50,
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
    right: 34,
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
