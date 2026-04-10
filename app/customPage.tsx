import * as ImagePicker from "expo-image-picker";

import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { use, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ArrowRight from "../assets/images/arrow-auth.svg";

import { SafeAreaProvider } from "react-native-safe-area-context";
import Arrowback from "../assets/images/arrow-back.svg";
import { CustomImage, CustomImageItem } from "./api/interface";
import { listCustomKeywordImages } from "./api/custom";

import CustomShow from "../components/customShow";
import Add from "../assets/images/add.svg";
import { PhotoObject } from "../app/api/interface";

const { width: screenWidth } = Dimensions.get("window");

export default function CustomPage() {
  const title = useLocalSearchParams().keyword;
  const keyword_id = useLocalSearchParams().keyword_id;
  const [item, setItem] = useState<CustomImage>();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}年${month}月${day}日`;
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await getCustomList();
    setRefreshing(false);
  };
  const groupByTime = (items: CustomImageItem[]) => {
    return items.reduce(
      (acc, item) => {
        const key = item.created_at;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      },
      {} as Record<string, CustomImageItem[]>,
    );
  };
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    getCustomList();
  }, []);
  const getCustomList = async () => {
    const response = await listCustomKeywordImages(keyword_id as string);
    setItem(response.data);
  };
  if (!item) return null;
  const grouped = groupByTime(item.items);
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={[styles.header,{backgroundColor:"#777676"}]}>
          {item?.cover_image && (
            <ImageBackground
              source={{ uri: item.cover_image.variants.original.url }}
              style={styles.headerBg}
              resizeMode="cover"
            />
          )}
          <Pressable style={styles.buttonGroup} onPress={handleGoBack}>
            <Arrowback />
          </Pressable>
          <Text style={styles.headertitle}>{title}</Text>
          <Pressable
            onPress={() => {
              router.navigate({
                pathname: "/chooseCover",
                params:{
                   images: JSON.stringify(item.items),
                   keyword_id: keyword_id,
                }
              })
            }}
            style={styles.changeCover}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 14 }}>修改封面</Text>
          </Pressable>
        </View>
        {item && (
          <FlatList
            data={Object.entries(grouped)}
            keyExtractor={([key]) => key}
            renderItem={({ item }) => {
              const [time, images] = item;
              return (
                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#333",
                      paddingHorizontal: 16,
                      marginBottom: 8,
                    }}
                  >
                    {formatDate(time)}
                  </Text>
                  <FlatList
                    horizontal
                    data={images}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <CustomShow item={item} />}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              );
            }}
            style={styles.postList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#72B6FF"]}
                tintColor="#72B6FF"
              />
            }
          />
        )}
      </View>
      <Pressable
        style={styles.add}
        onPress={() => {
          const handleOpenGallery = async () => {
            // 申请相册权限
            const { status } =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
              alert("需要相册权限才能选择照片");
              return;
            }
            // 打开相册
            const result = await ImagePicker.launchImageLibraryAsync({
              quality: 0.8,
              allowsMultipleSelection: true,
              mediaTypes: "images",
              allowsEditing: false,
            });

            if (!result.canceled) {
              const selectedPhotos = result.assets.map((asset, index) => ({
                id: index,
                uri: asset.uri,
                width: asset.width,
                height: asset.height,
                fileName: asset.fileName,
              }));
              console.log("子组件选中的照片列表:", selectedPhotos);
              router.navigate({
                pathname: "/beforePulish",
                params: {
                  type: "custom_keyword",
                  photos: JSON.stringify(selectedPhotos),
                  keyword_id: keyword_id,
                },
              });
            }
          };
          handleOpenGallery();
        }}
      >
        <Add />
      </Pressable>

    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 281,
    position: "relative",
    gap: 11,
  },
  headerBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  headertitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "#FFFFFF",
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
  postList: {
    shadowColor: "#000",
    backgroundColor: "#ffffff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 999,
    position: "absolute",
    top: 264,
    paddingTop: 17,
    width: screenWidth,
    flexDirection: "row",
  },
  changeCover: {
    width: 95,
    height: 32,
    borderRadius: 999,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 56,
    right: 19,
  },
  add: {
    width: 54,
    height: 54,
    backgroundColor: "#72B6FF",
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 74,
    right: 24,
  },
});
