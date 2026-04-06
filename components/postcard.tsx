import Post from "@/app/api/interface";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";

import { useRouter } from "expo-router";
import HaveIdea from "../assets/images/haveidea.svg";
import HaveLightIdea from "../assets/images/havelightIdea.svg";
import Heart from "../assets/images/heart.svg";
import HeartLight from "../assets/images/heartlight.svg";
import Sound from "../assets/images/sound1.svg";
import Ablum from "../assets/images/ablum.svg";
import { ImageBackground } from "expo-image";
const { width: screenWidth } = Dimensions.get("window");

const generateIdempotencyKey = () => {
  return `react_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 封装点赞/取消点赞的 API 请求
const reactToUpload = async (
  uploadId: string,
  reactionType: "inspired" | "resonated",
) => {
  const idempotencyKey = generateIdempotencyKey();
  try {
    const token = SecureStore.getItemAsync("access_token");
    const response = await fetch(
      `http://47.104.25.166:8080/v1/reactions/uploads/${uploadId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reaction_type: reactionType,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("请求失败");
    }
    return await response.json();
  } catch (error) {
    console.error("reactToUpload error:", error);
    throw error;
  }
};

export function PostCard({ post }: { post: Post }) {
  const router = useRouter();
  const [myReactions, setMyReactions] = useState<string[]>(
    post.my_reactions || [],
  );

  // 切换「有启发」反应
  const toggleInspiration = async () => {
    const newReactions = myReactions.includes("inspired")
      ? myReactions.filter((r) => r !== "inspired") // 取消
      : [...myReactions, "inspired"]; // 点赞
    setMyReactions(newReactions);

    try {
      await reactToUpload(String(post.id), "inspired");
    } catch (error) {
      // 请求失败时回滚状态
      setMyReactions(post.my_reactions || []);
      Alert.alert("操作失败", "请稍后重试");
    }
  };

  // 切换「有共鸣」反应
  const toggleEmpathy = async () => {
    const newReactions = myReactions.includes("resonated")
      ? myReactions.filter((r) => r !== "resonated")
      : [...myReactions, "resonated"];

    setMyReactions(newReactions);

    try {
      await reactToUpload(String(post.id), "resonated");
    } catch (error) {
      setMyReactions(post.my_reactions || []);
      Alert.alert("操作失败", "请稍后重试");
    }
  };

  return (
    <Pressable
      style={styles.postCard}
      onPress={() => {
        router.navigate({
          pathname: "/postCardDetail",
          params: { upload_id: String(post.id) },
        });
      }}
    >
      <ImageBackground
        source={{ uri: post.cover_image.variants.card_4x3.url }}
        style={styles.postImage}
      />

      <View
        style={{
          width: 42,
          height: 22,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: 999,
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          right: 6,
          zIndex: 1,
          bottom: 70,
          flexDirection: "row",
          gap: 5,
        }}
      >
        <Ablum></Ablum>
        <Text style={{ color: "#fff", fontSize: 10 }}>{post.image_count}</Text>
      </View>

      <Text style={styles.postCaption} numberOfLines={1}>
        {post.display_text}
      </Text>

      <View style={styles.interactionRow}>
        <Pressable style={styles.interactionButton} onPress={toggleInspiration}>
          {myReactions.includes("inspired") ? <HaveIdea /> : <HaveLightIdea />}
          <Text
            style={[
              styles.interactionText,
              myReactions.includes("inspired")
                ? { color: "#999999" }
                : { color: "#666666" },
            ]}
          >
            有启发
          </Text>
        </Pressable>

        <Pressable style={styles.interactionButton} onPress={toggleEmpathy}>
          {myReactions.includes("resonated") ? <Heart /> : <HeartLight />}
          <Text
            style={[
              styles.interactionText,
              myReactions.includes("resonated")
                ? { color: "#999999" }
                : { color: "#666666" },
            ]}
          >
            有共鸣
          </Text>
        </Pressable>

        {post.cover_has_audio && (
          <View style={styles.audioInfo}>
            <Text style={styles.audioDuration}>
              {post.cover_audio_duration_ms}'
            </Text>
            <Sound />
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  postCard: {
    marginBottom: 24,
    borderRadius: 12,
    height: 500,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: "relative",
  },
  postImage: {
    width: screenWidth - 32,
    height: 436,
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
  audioInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 13,
    bottom: 15,
  },
  audioDuration: {
    color: "#666666",
    fontSize: 12,
    marginRight: 4,
  },
});
