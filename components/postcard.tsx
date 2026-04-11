import Post from "@/app/api/interface";
import { useState, useRef, useEffect } from "react";
import {
  Dimensions,
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
import { putReaction, deleteReaction } from "@/app/api/keywords";

const { width: screenWidth } = Dimensions.get("window");

export function PostCard({ post }: { post: Post }) {
  const router = useRouter();
  const [myReactions, setMyReactions] = useState<string[]>(post.my_reactions || []);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isRequestingRef = useRef<{
    inspired?: boolean;
    resonated?: boolean;
  }>({});

  const doReact = async (
    uploadId: string,
    reactionType: "inspired" | "resonated",
    isAdd: boolean
  ) => {
    try {
      let res;
      if (isAdd) {
        res = await putReaction(uploadId, reactionType);
      } else {
        res = await deleteReaction(uploadId, reactionType);
      }

      if (res.status === 204 || res.status === 200) {
        return true;
      } else {
        console.error("reaction error", res.status);
        return false;
      }
    } catch (error) {
      console.error("doReact 捕获异常:", error);
      return false;
    }
  };

  const toggleInspired = () => {
    const isActive = myReactions.includes("inspired");
    const next = isActive
      ? myReactions.filter(r => r !== "inspired")
      : [...myReactions, "inspired"];

    setMyReactions(next);

    if (isRequestingRef.current.inspired) return;
    clearTimeout(debounceRef.current!);

    debounceRef.current = setTimeout(async () => {
      isRequestingRef.current.inspired = true;
      const ok = await doReact(String(post.id), "inspired", !isActive);
      isRequestingRef.current.inspired = false;

      if (!ok) {
        setMyReactions(post.my_reactions || []);
        Alert.alert("操作失败", "请稍后重试");
      }
    }, 300);
  };

  const toggleResonated = () => {
    const isActive = myReactions.includes("resonated");
    const next = isActive
      ? myReactions.filter(r => r !== "resonated")
      : [...myReactions, "resonated"];

    setMyReactions(next);

    if (isRequestingRef.current.resonated) return;
    clearTimeout(debounceRef.current!);

    debounceRef.current = setTimeout(async () => {
      isRequestingRef.current.resonated = true;
      const ok = await doReact(String(post.id), "resonated", !isActive);
      isRequestingRef.current.resonated = false;

      if (!ok) {
        setMyReactions(post.my_reactions || []);
        Alert.alert("操作失败", "请稍后重试");
      }
    }, 300);
  };
  useEffect(() => {
    return () => clearTimeout(debounceRef.current!);
  }, []);

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
        <Pressable style={styles.interactionButton} onPress={toggleInspired}>
          {myReactions.includes("inspired") ?   <HaveLightIdea />:<HaveIdea />}
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

        <Pressable style={styles.interactionButton} onPress={toggleResonated}>
          {myReactions.includes("resonated") ?  <HeartLight />:<Heart /> }
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