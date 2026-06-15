import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, StyleSheet, Dimensions } from 'react-native';
import usePromptStore from '@/app/stores/usePromptStore';
import { useImageStore } from '@/app/stores/useImageStore';
const { width: screenWidth } = Dimensions.get('window');
export function TakePhotoWay() {
  const settakenPhoto = useImageStore((state) => state.settakenPhoto);
  // 打开相机
  const router = useRouter();
  const handleOpenCamera = async () => {
    // 申请相机权限
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('需要相机权限才能拍摄照片');
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
      settakenPhoto(photo);
      router.navigate({
        pathname: '/beforePulish',
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
export function PhotoWay() {
  const setSelectedPhotos = useImageStore((state) => state.setSelectedPhotos);

  const router = useRouter();
  // 打开相册
  const keyword_id = usePromptStore((state) => state.keyword_id);
  const handleOpenGallery = async () => {
    // 申请相册权限
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('需要相册权限才能选择照片');
      return;
    }
    // 打开相册
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
      allowsMultipleSelection: true,
      mediaTypes: 'images',
      allowsEditing: false,
    });

    if (!result.canceled) {
      // 设置选中的照片
      const selectedPhotos = result.assets.map((asset, index) => ({
        id: index,
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        fileName: asset.fileName,
      }));
      setSelectedPhotos(selectedPhotos);
      router.navigate({
        pathname: '/beforePulish',
        params: {
          type: 'official_today',
          keyword_id: keyword_id,
        },
      });
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
    flexDirection: 'column',
    width: screenWidth * (158 / 375),
    height: 80,
    borderRadius: 20,
    borderColor: '#EEEEEE',
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    paddingVertical: 19,
    paddingLeft: 20,
    gap: 2,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3D3D3D',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#72B6FF',
    marginTop: 2,
    lineHeight: 20,
  },
});
