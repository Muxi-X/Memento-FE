import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View, StyleSheet, Alert } from "react-native";
import { PhotoObject } from "../app/api/interface";
import { logger } from "react-native-reanimated/lib/typescript/common";
import usePromptStore from "@/app/stores/usePromptStore";
export function TakePhotoWay() {
  // 打开相机
   const router=useRouter();
  const handleOpenCamera = async () => {
    // 申请相机权限
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("需要相机权限才能拍摄照片");
      return;
    }
    // 打开相机
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
       const photo = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
        width: result.assets[0].width,
        height: result.assets[0].height,
        fileName: result.assets[0].fileName,
      };
      console.log("拍摄的照片:", result.assets[0].uri);
      Alert.alert("拍摄成功", `已获取照片：${result.assets[0].uri.substring(0, 20)}...`);
         router.navigate({
      pathname: "/beforePulish",
        params: {
          photos: JSON.stringify([photo]), 
        },
    });
    }
 
  };

  return (
    <Pressable style={styles.optionItem} onPress={handleOpenCamera}>
      <Text style={styles.optionTitle}>拍摄照片</Text>
      <Text style={styles.optionSubtitle}>打开相机即时创作</Text>
    </Pressable>
  );
}
interface PhotoWayProps {
  onPhotosSelected: (photos: PhotoObject[]) => void;
}

export function PhotoWay({ onPhotosSelected}: PhotoWayProps) {
    const router=useRouter();
  // 打开相册
  const keyword_id=usePromptStore(state => state.keyword_id);
  const handleOpenGallery = async () => {
    // 申请相册权限
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
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


      if (typeof onPhotosSelected === "function") {
        onPhotosSelected(selectedPhotos);
      }
      console.log("子组件选中的照片列表:", selectedPhotos);      
    router.navigate({
      pathname: "/beforePulish",
        params: {
          type:"official_today",
        photos: JSON.stringify(selectedPhotos),
        keyword_id:keyword_id,
      }
    })
      
    }
  };

  return (
    <Pressable style={styles.optionItem} onPress={handleOpenGallery}>
      <Text style={styles.optionTitle}>从相册中选择</Text>
      <Text style={styles.optionSubtitle}>使用已有照片</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  optionItem: {
    flexDirection: "column",
    width: 158,
    height: 80,
    borderRadius: 20,
    borderColor: "#EEEEEE",
    borderWidth: 2,
    backgroundColor: "#FFFFFF",
    paddingVertical: 19,
    paddingLeft: 20,
    gap: 2,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#3D3D3D",
  },
  optionSubtitle: {
    fontSize: 12,
    color: "#72B6FF",
    marginTop: 2,
    lineHeight: 20,
  },
});