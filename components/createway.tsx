import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Pressable, Text, View, StyleSheet, Alert, Platform } from 'react-native';
import Picture from '../assets/images/picture.svg';
import Camera from '../assets/images/photogarph.svg';
import { useRouter } from 'expo-router';

const Createway = () => {
  const router = useRouter();

  // 打开相机
  const handleOpenCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted' ) {
      Alert.alert('权限不足', '需要相机权限才能拍摄照片，请前往设置开启');
      return;
    }

    // 打开相机
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ 明确只选图片
    });

    if (!result.canceled) {
      const photo = {
        id: 0,
        uri: result.assets[0].uri,
        width: result.assets[0].width,
        height: result.assets[0].height,
        fileName: result.assets[0].fileName,
      };
      console.log('拍摄的照片:', photo);
      Alert.alert('拍摄成功', '已获取照片，即将跳转编辑页面');
      

      router.navigate({
        pathname: '/beforepulish',
        params: {
          photos: JSON.stringify([photo]), 
        },
      });
    }
  };

  // 打开相册
  const handleOpenGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted' ) {
      Alert.alert('权限不足', '需要相册权限才能选择照片，请前往设置开启');
      return;
    }

    // 打开相册
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsEditing: false,
    });

    if (!result.canceled) {
      const selectedPhotos = result.assets.map((asset, index) => ({
        id: index,
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        fileName: asset.fileName || `photo_${index}`, 
      }));

      console.log('选中的照片列表:', selectedPhotos);
      Alert.alert('选择成功', `共选中 ${selectedPhotos.length} 张照片`);
      
      // 跳转并传参
      router.navigate({
        pathname: '/beforepulish',
        params: {
          photos: JSON.stringify(selectedPhotos),
        },
      });
    }
  };

  return (
    <>
      {/* 拍摄按钮 */}
      <Pressable 
        style={styles.optionItem} 
        onPress={handleOpenCamera}
        android_ripple={{ color: '#EFEFEF'}} 
      >
        <View style={styles.iconWrapper}>
          <Camera />
        </View>
        <View style={styles.optionTextWrapper}>
          <Text style={styles.optionTitle}>拍摄照片</Text>
          <Text style={styles.optionSubtitle}>打开相机即时创作</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </Pressable>

      {/* 相册按钮 */}
      <Pressable 
        style={styles.optionItem} 
        onPress={handleOpenGallery}
        android_ripple={{ color: '#EFEFEF' }}
      >
        <View style={styles.iconWrapper}>
          <Picture />
        </View>
        <View style={styles.optionTextWrapper}>
          <Text style={styles.optionTitle}>从相册中选择</Text>
          <Text style={styles.optionSubtitle}>使用已有照片</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </Pressable>
    </>
  );
};


const styles = StyleSheet.create({
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 19,
    paddingHorizontal: 23,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22, 
    backgroundColor: '#EFF7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTextWrapper: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3D3D3D',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  arrow: {
    fontSize: 22,
    color: '#999999',
    fontWeight: '300', // ✅ 箭头更细，视觉更协调
  },
});

export default Createway;