import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Arrowback from "../assets/images/arrow-back.svg";
import { useRouter, useFocusEffect } from "expo-router";
import ArrowRight from "../assets/images/arrow-auth.svg";
import { useCallback, useState } from "react";
import { useMyStore } from "./stores/authstore";
import * as ImagePicker from "expo-image-picker";
import { getInfoAsync } from "expo-file-system/legacy";
import BaseTouXiang from "../assets/images/baseTouxiang.svg";
import {
  createAvatarUploadSession,
  presignAvatarUpload,
  completeAvatarUpload,
  getMedata,
} from "./api/me";
type ImageExt = "jpg" | "jpeg" | "png" | "gif";
export default function SetAuthdata() {
  const name = useMyStore((state) => state.nickname);
  const avatar_url = useMyStore((state) => state.avatar_url);
  const email = useMyStore((state) => state.email);
  const setNickname = useMyStore((state) => state.setNickname);
  const setAvatar = useMyStore((state) => state.setAvatar);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  // 页面聚焦时刷新用户数据
  const loadUserData = useCallback(async () => {
    try {
      const res = await getMedata();
      setNickname(res.data.nickname);
      if (res.data.avatar_url) {
        setAvatar(res.data.avatar_url);
      }
    } catch (e) {
      console.log(e);
    }
  }, [setNickname, setAvatar]);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [loadUserData]),
  );

  // 从响应中获取 hash
  const getHashFromResponse = async (resp: Response): Promise<string> => {
    let hash = "";
    try {
      const body = await resp.json();
      hash = body.hash || "";
    } catch {}

    // 如果 body 中没有，尝试从 header 获取
    if (!hash) {
      hash = resp.headers.get("etag") || resp.headers.get("ETag") || "";
      hash = hash.replace(/^"|"$/g, "");
    }

    return hash;
  };
  // 获取文件信息
  const getFileSize = useCallback(async (uri: string) => {
    try {
      const res = await getInfoAsync(uri);
      return res.exists ? res.size : 0;
    } catch {
      return 0;
    }
  }, []);
  // 上传头像逻辑
  const handleOpenGallery = async () => {
    if (isUploading) return;

    // 1. 申请权限
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("提示", "需要相册权限才能选择照片");
      return;
    }

    // 2. 选择图片
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.canceled || !result.assets.length) return;

    const asset = result.assets[0];
    console.log("选中信息", asset);

    setIsUploading(true);

    try {
      //  创建上传会话
      const sessionRes = await createAvatarUploadSession();
      const sessionId = sessionRes.data.session_id;
      console.log("会话ID", sessionId);

      // 4. 获取文件信息
      const fileInfo = await getFileSize(asset.uri);
      console.log("文件信息", fileInfo);
      const imgExt = (asset.uri.split(".").pop()?.toLowerCase() ||
        "jpg") as ImageExt;
      // 5. 获取预签名地址
      const presignRes = await presignAvatarUpload(sessionId, {
        image_content_length: fileInfo,
        image_content_type: `image/${imgExt}`,
      });

      const { image_upload } = presignRes.data;
      const upload = image_upload;
      const formData = new FormData();
      // 遍历 form_fields
      if (upload.form_fields) {
        for (const [k, v] of Object.entries(upload.form_fields)) {
          formData.append(k, v as string);
        }
      }
      // 传 key
      formData.append("key", upload.object_key);

      const fileName =
        asset.fileName || asset.uri.split("/").pop() || "avatar.jpg";
      // @ts-ignore
      formData.append("file", {
        uri: asset.uri,
        type: `image/${imgExt}`,
        name: fileName,
      });

      const fetchOpts: RequestInit = {
        method: upload.method,
        body: formData,
      };
      // headers 可能为 null，过滤掉
      if (upload.headers) {
        fetchOpts.headers = upload.headers;
      }

      const resp = await fetch(upload.url, fetchOpts);
      const hash = await getHashFromResponse(resp);

      if (!hash) {
        throw new Error("头像上传失败：未获取到 hash");
      }

      // 7. 完成上传
      const completeRes = await completeAvatarUpload(sessionId, {
        image_etag: hash,
        image_width: asset.width || 400,
        image_height: asset.height || 400,
      });

      if (completeRes.data.avatar_url) {
        setAvatar(completeRes.data.avatar_url);
      }

      Alert.alert("成功", "头像更新成功！");
    } catch (error) {
      console.error("上传流程出错:", error);
      Alert.alert("错误", "上传失败，请重试");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* 加载遮罩 */}
      {isUploading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#72B6FF" />
            <Text style={styles.loadingText}>正在上传中...</Text>
          </View>
        </View>
      )}

      <SafeAreaProvider style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              router.back();
            }}
            style={styles.arrowback}
          >
            <Arrowback />
          </Pressable>
          <Text style={styles.headertext}>个人资料</Text>
        </View>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            width: "100%",
            backgroundColor: "#F9F9F9",
          }}
        >
          <View style={styles.body}>
            <Pressable style={styles.kuang} onPress={handleOpenGallery}>
              <Text style={styles.text}>头像</Text>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 50,
                  overflow: "hidden",
                }}
              >
                {avatar_url ? (
                  <Image
                    source={{ uri: avatar_url }}
                    style={{ width: 24, height: 24 }}
                  />
                ) : (
                  <BaseTouXiang />
                )}
              </View>
              <Pressable style={styles.ArrowRight}>
                <ArrowRight />
              </Pressable>
            </Pressable>
            <Pressable
              style={styles.kuang}
              onPress={() => {
                router.navigate("/updateName");
              }}
            >
              <Text style={styles.text}>昵称</Text>
              <Text>{name}</Text>
              <Pressable style={styles.ArrowRight}>
                <ArrowRight />
              </Pressable>
            </Pressable>
            <View style={styles.kuang}>
              <Text style={styles.text}>账号</Text>
              <Text>{email}</Text>
            </View>
          </View>
        </View>
      </SafeAreaProvider>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 44,
    width: "100%",
    marginTop: 44,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "#fff",
  },
  arrowback: {
    left: 26,
    position: "absolute",
  },
  headertext: {
    fontSize: 16,
    fontWeight: "500",
  },
  body: {
    height: 130,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    marginTop: 30,
    paddingHorizontal: 23,
    paddingTop: 16,
  },
  kuang: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  text: {
    fontSize: 14,
    color: "#666666",
    marginRight: 36,
  },
  ArrowRight: {
    width: 5,
    height: 10,
    position: "absolute",
    right: 0,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  loadingContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});
