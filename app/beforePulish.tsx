import VoiceRecorder from "@/components/voiceRecord";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardProvider,
} from "react-native-keyboard-controller";
import AddPhotos from "../assets/images/addphoto.svg";
import Arrow_back from "../assets/images/arrow-back.svg";
import Sound from "../assets/images/sound.svg";
import Voicecocle from "../assets/images/voiceConcel.svg";
import {
  commitUpload,
  CompleteItem,
  completeUpload,
  CreateSession,
  PresignItem,
  presignUpload,
} from "./api/Publish";
import usePromptStore from "./stores/usePromptStore";

interface PhotoItem {
  id: string | number;
  uri: string;
  width: number;
  height: number;
  fileName?: string | null;
  title: string;
  desc: string;
  recordingUri: string | null;
  recordingDuration: number;
  isCover: boolean;
}
interface image_upload {
  client_image_id: string;
  item_id: string;
  image_id: string;
  image_upload: {
    method: "put";
    url: string;
    headers?: Record<string, string>;
    objectkey: string;
  };
  audio_upload?: {
    method: "put";
    url: string;
    headers: Record<string, string>;
    objectkey: string;
  };

  expires_at: string;
}
type RenderItemType = PhotoItem | { type: "add" };
type ImageExt = "jpg" | "jpeg" | "png" | "gif";
type AudioExt = "mp3" | "wav" | "aac" | "m4a";

const { width: screenWidth } = Dimensions.get("window");
const ITEM_WIDTH = screenWidth * 0.85;

const BeforePublish = () => {
  const type = useLocalSearchParams().type;
  const photos = useLocalSearchParams().photos;
  const keyword_id = useLocalSearchParams().keyword_id;
  console.log(photos);

  const navigation = useNavigation();
  const router = useRouter();

  const [backAlert, setBackAlert] = useState(false);
  const [photoList, setPhotoList] = useState<PhotoItem[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [currentActiveIndex, setCurrentActiveIndex] = useState(-1);

  const keywordId = usePromptStore((state) => state.keyword_id);
  const bizDate = usePromptStore((state) => state.date);
  const getFileSize = useCallback(async (uri: string) => {
    try {
      const res = await fetch(uri);
      const blob = await res.blob();
      return blob.size;
    } catch {
      return 0;
    }
  }, []);
  const getFullMediaParams = useMemo(() => {
    return photoList.map((item, idx) => ({
      clientId: String(item.id),
      uri: item.uri,
      title: item.title === "" ? null : item.title,
      desc: item.desc === "" ? null : item.desc,
      audioUri: item.recordingUri ? item.recordingUri : undefined,
      audioMs: item.recordingDuration ? item.recordingDuration : undefined,
      width: item.width,
      height: item.height,
      isCover: item.isCover,
      sort: idx,
    }));
  }, [photoList]);

  // 创建上传会话
  const createUploadSession = useCallback(async () => {
    if (!keywordId || photoList.length === 0) {
      Alert.alert("提示", "缺少关键词或未选择图片");
      return null;
    }
    try {
      let res: any;
      if (type === "custom_keyword") {
        res = await CreateSession({
          context: {
            type: type,
            custom_keyword_id: keyword_id as string,
          },
          expected_image_count: photoList.length,
        });
      } else {
        res = await CreateSession({
          context: {
            type: type as string,
            official_keyword_id: keywordId,
            biz_date: bizDate,
          },
          expected_image_count: photoList.length,
        });
      }
      const sid = res.data.session_id;
      return sid;
    } catch (err) {
      console.error("创建会话失败", err);
      Alert.alert("错误", "创建发布会话失败");
      return null;
    }
  }, [photoList, keywordId, bizDate]);

  //  获取预签名
  const getPresignList = useCallback(
    async (sid: string) => {
      const reqItems: PresignItem[] = [];
      for (const m of getFullMediaParams) {
        const imgSize = await getFileSize(m.uri);
        const imgExt = (m.uri.split(".").pop()?.toLowerCase() ||
          "jpg") as ImageExt;
        let audioSize: number | undefined;
        let audioType: AudioExt | undefined;
        if (m.audioUri) {
          audioSize = await getFileSize(m.audioUri);
          audioType = (m.audioUri.split(".").pop()?.toLowerCase() ||
            "mp3") as AudioExt;
        }

        reqItems.push({
          client_image_id: m.clientId,
          image_content_type: `image/${imgExt}`,
          image_content_length: imgSize,
          audio_content_type: audioType ? `audio/${audioType}` : null,
          audio_content_length: audioSize ? audioSize : null,
        });
      }
      const res = await presignUpload(sid, reqItems);
      console.log("========oooo", reqItems);

      console.log("____________________", res.data);

      return res.data["items"] as image_upload[];
    },
    [getFullMediaParams, getFileSize],
  );

  //上传文件
  const uploadByPresign = useCallback(
    async (presignArr: image_upload[]) => {
      const result: Array<{
        clientId: string;
        imgEtag: string;
        audioEtag: string | null;
      }> = [];

      for (let index = 0; index < presignArr.length; index++) {
        let imgEtag = null;
        let audioEtag = null;
        const item = presignArr[index];
        const x = getFullMediaParams[index];
        // 传图片
        if (item.image_upload) {
          const blob = await fetch(x.uri).then((r) => r.blob());
          const resp = await axios({
            method: item.image_upload.method,
            url: item.image_upload.url,
            headers: item.image_upload.headers,
            transformRequest: [(data) => data],
            maxContentLength: -1,
            data: blob,
          });
          imgEtag =
            resp.headers.etag || resp.headers.ETag || resp.headers["Etag"];
          imgEtag = imgEtag.replace(/^"|"$/g, "");
          if (imgEtag === "") {
            throw new Error("图片上传失败：未获取到 ETag");
          }
        }

        // 传音频
        if (item.audio_upload && item.audio_upload.url && x.audioUri) {
          const blob = await fetch(x.audioUri).then((r) => r.blob());
          const resp = await axios({
            method: item.audio_upload.method,
            url: item.audio_upload.url,
            headers: item.audio_upload.headers,
            transformRequest: [(data) => data],
            maxContentLength: -1,
            data: blob,
          });
          audioEtag = resp.headers.etag || resp.headers.ETag;
          audioEtag = audioEtag.replace(/^"|"$/g, "");
        }

        result.push({
          clientId: item.client_image_id,
          imgEtag,
          audioEtag,
        });
      }
      console.log("result", result);

      return result;
    },
    [getFullMediaParams],
  );

  const handlePublish = useCallback(async () => {
    if (photoList.length === 0 || isPublishing) return;
    setIsPublishing(true);
    Alert.alert("提示", "开始发布，请稍候...");

    try {
      const sid = await createUploadSession();
      if (!sid) throw new Error("会话创建失败");
      const presignArr = await getPresignList(sid);
      if (!presignArr || presignArr.length === 0) throw new Error("预签名失败");
      console.log("---------------", presignArr);
      const uploadRes = await uploadByPresign(presignArr);
      console.log("oooooooooooooyyyyyy", uploadRes);

      const completeData: CompleteItem[] = getFullMediaParams.map(
        (media, index) => {
          const u = uploadRes[index];
          const currentPresign = presignArr[index];
          return {
            item_id: currentPresign.item_id,
            image_etag: u.imgEtag,
            image_width: media.width,
            image_height: media.height,
            display_order: media.sort + 1,
            is_cover: media.isCover,
            title: media.title || null,
            note: media.desc || null,
            audio_etag: u?.audioEtag ?? null,
            audio_duration_ms: media.audioMs ?? null,
          };
        },
      );
      console.log("完成发布的数据", completeData);
      console.log("完整请求体:", JSON.stringify(completeData, null, 2));
      await completeUpload(sid, completeData);
      await commitUpload(sid);

      Alert.alert("成功", "发布完成！");
      router.push("/(tabs)/remember");
      setPhotoList([]);
      setCurrentActiveIndex(-1);
    } catch (err) {
      console.error("发布整体失败", err);
      Alert.alert("错误", "发布失败，请重试");
    } finally {
      setIsPublishing(false);
    }
  }, [photoList, router]);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    try {
      if (photos && typeof photos === "string") {
        const parsed = JSON.parse(photos);
        console.log("parsed", parsed);
        if (Array.isArray(parsed)) {
          const init: PhotoItem[] = parsed.map((item, idx) => ({
            ...item,
            title: "",
            desc: "",
            recordingUri: null,
            recordingDuration: 0,
            isCover: idx === 0,
          }));
          setPhotoList(init);
          setCurrentActiveIndex(0);
        }
      }
    } catch (e) {
      console.error("解析照片失败", e);
    }
  }, [photos]);

  const handleRecordingSaved = useCallback(
    (uri: string, duration: number) => {
      if (currentActiveIndex < 0) return;
      setPhotoList((prev) =>
        prev.map((item, idx) =>
          idx === currentActiveIndex
            ? {
                ...item,
                recordingUri: uri,
                recordingDuration: Math.round(duration),
              }
            : item,
        ),
      );
    },
    [currentActiveIndex],
  );

  const handleDeleteRecording = useCallback(() => {
    if (currentActiveIndex < 0) return;
    Alert.alert("确认删除", "删除当前录音？", [
      { text: "取消", style: "cancel" },
      {
        text: "删除",
        style: "destructive",
        onPress: () =>
          setPhotoList((prev) =>
            prev.map((item, idx) =>
              idx === currentActiveIndex
                ? { ...item, recordingUri: null, recordingDuration: 0 }
                : item,
            ),
          ),
      },
    ]);
  }, [currentActiveIndex]);

  const handleAddPhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("权限不足", "请开启相册权限");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: true,
      quality: 1,
    });
    if (!res.canceled) {
      const maxId =
        photoList.length > 0
          ? Math.max(...photoList.map((item) => Number(item.id)))
          : -1;
      const newArr: PhotoItem[] = res.assets.map((a, i) => ({
        id: maxId + 1 + i,
        uri: a.uri,
        width: a.width || 0,
        height: a.height || 0,
        fileName: a.fileName,
        title: "",
        desc: "",
        recordingUri: null,
        recordingDuration: 0,
        isCover: false,
      }));
      setPhotoList((prev) => [...prev, ...newArr]);
      if (currentActiveIndex === -1) setCurrentActiveIndex(0);
    }
  }, [currentActiveIndex]);

  const handleDeletePhoto = useCallback(
    (delIdx: number) => {
      Alert.alert("删除图片？", "", [
        { text: "取消", style: "cancel" },
        {
          text: "删除",
          style: "destructive",
          onPress: () => {
            const next = photoList.filter((_, i) => i !== delIdx);
            if (photoList[delIdx]?.isCover && next.length)
              next[0].isCover = true;

            let newIdx = currentActiveIndex;
            if (newIdx === delIdx) newIdx = next.length ? 0 : -1;
            else if (newIdx > delIdx) newIdx -= 1;

            setPhotoList(next);
            setCurrentActiveIndex(newIdx);
          },
        },
      ]);
    },
    [photoList, currentActiveIndex],
  );

  const handleSetCover = useCallback((idx: number) => {
    setPhotoList((prev) =>
      prev.map((item, i) => ({
        ...item,
        isCover: i === idx,
      })),
    );
    Alert.alert("已设为封面");
  }, []);

  const handleTitleChange = useCallback(
    (txt: string) => {
      if (currentActiveIndex < 0) return;
      setPhotoList((prev) =>
        prev.map((item, i) =>
          i === currentActiveIndex ? { ...item, title: txt } : item,
        ),
      );
    },
    [currentActiveIndex],
  );

  const handleDescChange = useCallback(
    (txt: string) => {
      if (currentActiveIndex < 0) return;
      setPhotoList((prev) =>
        prev.map((item, i) =>
          i === currentActiveIndex ? { ...item, desc: txt } : item,
        ),
      );
    },
    [currentActiveIndex],
  );

  const handleScroll = useCallback(
    (e: any) => {
      const idx = Math.floor(e.nativeEvent.contentOffset.x / (ITEM_WIDTH + 40));
      if (idx >= 0 && idx < photoList.length) setCurrentActiveIndex(idx);
    },
    [photoList.length],
  );

  const renderData = useMemo<RenderItemType[]>(
    () => [...photoList, { type: "add" }],
    [photoList],
  );
  const keyExtractor = useCallback((item: RenderItemType) => {
    if ("type" in item) return "add-btn";
    return String(item.id);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: RenderItemType }) => {
      if ("type" in item) {
        return (
          <Pressable
            style={[styles.imageItemContainer]}
            onPress={handleAddPhoto}
          >
            <View style={[styles.addIconContainer]}>
              <AddPhotos />
            </View>
          </Pressable>
        );
      }
      const p = item as PhotoItem;
      return (
        <View style={styles.imageItemContainer}>
          <Image
            source={{ uri: p.uri }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      );
    },
    [handleAddPhoto],
  );
  const currentPhoto =
    currentActiveIndex >= 0 ? photoList[currentActiveIndex] : null;

  return (
    <KeyboardProvider>
      <KeyboardAwareScrollView
        bottomOffset={200}
        contentContainerStyle={{ paddingBottom: 40 }}
        style={styles.container}
      >
        <View
          style={[styles.container, { alignItems: "center", paddingTop: 56 }]}
        >
          {/* 头部 */}
          <View style={styles.header}>
            <Pressable onPress={() => setBackAlert(true)} style={styles.goback}>
              <Arrow_back />
            </Pressable>

            {backAlert && (
              <View
                style={{
                  width: 113,
                  height: 60,
                  borderRadius: 12,
                  backgroundColor: "#fff",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  gap: 7,
                  left: 24,
                  shadowColor: "#000",
                  shadowOffset: { width: 4, height: 10 },
                  shadowOpacity: 0.1,
                  zIndex: 999,
                }}
              >
                <Pressable onPress={() => navigation.goBack()}>
                  <Text style={{ color: "#FE585B", fontSize: 12 }}>
                    不保留返回
                  </Text>
                </Pressable>
                <View
                  style={{
                    width: 97,
                    height: 0,
                    borderTopColor: "#EEEEEE",
                    borderTopWidth: 1,
                  }}
                ></View>
                <Pressable onPress={() => setBackAlert(false)}>
                  <Text style={{ color: "#3D3D3D", fontSize: 12 }}>
                    保留编辑
                  </Text>
                </Pressable>
              </View>
            )}

            <Pressable
              style={[
                styles.button2,
                isPublishing && { backgroundColor: "#ccc" },
              ]}
              onPress={handlePublish}
              disabled={isPublishing}
            >
              <Text style={{ color: "#FFF", fontWeight: "500", fontSize: 15 }}>
                {isPublishing ? "发布中..." : "发布"}
              </Text>
            </Pressable>
          </View>

          {/* 图片展示区 */}
          <View style={styles.photoshow}>
            {photoList.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={{ color: "#999" }}>暂无选中的照片</Text>
              </View>
            ) : (
              <>
                <Pressable
                  style={[
                    styles.coverbtn1,
                    currentPhoto?.isCover && {
                      backgroundColor: "#72B6FF",
                      width: 50,
                    },
                  ]}
                  onPress={() =>
                    currentActiveIndex >= 0 &&
                    handleSetCover(currentActiveIndex)
                  }
                >
                  <Text style={{ color: "#fff" }}>
                    {currentPhoto?.isCover ? "封面" : "设为封面"}
                  </Text>
                </Pressable>

                <FlatList
                  data={renderData}
                  renderItem={renderItem}
                  keyExtractor={keyExtractor}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.flatListContent}
                  snapToAlignment="center"
                  decelerationRate="fast"
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                />
              </>
            )}
          </View>

          {/* 文案输入区 */}
          {currentPhoto && (
            <View style={styles.copywriting}>
              <TextInput
                style={{ color: "#999", fontSize: 16, marginBottom: 5 }}
                placeholder="为你的照片取个名字"
                value={currentPhoto.title}
                onChangeText={handleTitleChange}
              />
              <TextInput
                placeholder="分享你对这个关键词的理解、照片背后的故事~"
                placeholderTextColor="#CCC"
                style={styles.textInput}
                multiline
                value={currentPhoto.desc}
                onChangeText={handleDescChange}
              />
              {currentPhoto.recordingUri && (
                <View style={styles.voice}>
                  <View style={styles.voiceBar}>
                    <Sound width={16} height={16} />
                    <Text style={styles.voiceDuration}>
                      {currentPhoto.recordingDuration}'
                    </Text>
                  </View>
                  <Pressable
                    onPress={handleDeleteRecording}
                    style={styles.deleteVoice}
                  >
                    <Voicecocle />
                  </Pressable>
                </View>
              )}
            </View>
          )}

          {photoList.length > 0 && (
            <VoiceRecorder onRecordingSaved={handleRecordingSaved} />
          )}
        </View>
      </KeyboardAwareScrollView>
    </KeyboardProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",

    position: "relative",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  goback: {
    width: 36,
    height: 36,
    backgroundColor: "#FFF",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: "auto",
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button2: {
    width: 73,
    height: 32,
    borderRadius: 9999,
    backgroundColor: "#72B6FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  photoshow: {
    height: 417,
    width: "100%",
    overflow: "hidden",
    alignItems: "center",
  },
  emptyContainer: { alignItems: "center", justifyContent: "center" },
  flatListContent: {},
  imageItemContainer: {
    width: screenWidth,
    overflow: "hidden",
    alignItems: "center",
    position: "relative",
    shadowColor: "rgba(0,0,0)",
    shadowOffset: { width: 4, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  image: {
    width: 257,
    height: 343,
    borderRadius: 20,
    shadowColor: "rgba(0,0,0)",
    shadowOffset: { width: 4, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  coverbtn1: {
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 90,
    height: 28,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  addIconContainer: {
    width: 257,
    height: 343,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFEFEF",
    borderRadius: 20,
  },
  copywriting: {
    width: "90%",
    minHeight: 140,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 11,
  },
  textInput: {
    fontSize: 14,
    color: "#333",
    minHeight: 40,
  },
  voice: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    alignItems: "center",
    gap: 9,
    height: 34,
    width: 123,
  },
  voiceBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    width: 100,
    height: "100%",
    borderRadius: 16,
    borderColor: "#CCC",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 8,
  },
  voiceDuration: { fontSize: 14, color: "#333" },
  deleteVoice: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#D8D8D8",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BeforePublish;
