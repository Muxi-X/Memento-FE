import * as ImagePicker from 'expo-image-picker';
import  React, {useState}from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Picture from '../assets/images/picture.svg'
import Camera from '../assets/images/photogarph.svg'
  const [modalVisible, setModalVisible] = useState(false);
  // 打开相机
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
      console.log('拍摄的照片:', result.assets[0].uri);
      setModalVisible(false);
    }
  };

  // 打开相册
  const handleOpenGallery = async () => {
    // 申请相册权限
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('需要相册权限才能选择照片');
      return;
    }
    // 打开相册
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      console.log('选择的照片:', result.assets[0].uri);//后续处理上传的照片
      setModalVisible(false);
    }
  };
   function Createway(){
return(<>
                <Pressable style={styles.optionItem} onPress={handleOpenCamera}>
                  <View style={styles.iconWrapper}>
                    <Camera></Camera>
                  </View>
                  <View style={styles.optionTextWrapper}>
                    <Text style={styles.optionTitle}>拍摄照片</Text>
                    <Text style={styles.optionSubtitle}>打开相机即时创作</Text>
                  </View>
                  <Text style={styles.arrow}>›</Text>
                </Pressable>
    
                {/* 相册 */}
                <Pressable style={styles.optionItem} onPress={handleOpenGallery}>
                  <View style={styles.iconWrapper}>
                    <Picture></Picture>
                  </View>
                  <View style={styles.optionTextWrapper}>
                    <Text style={styles.optionTitle}>从相册中选择</Text>
                    <Text style={styles.optionSubtitle}>使用已有照片</Text>
                  </View>
                  <Text style={styles.arrow}>›</Text>
                </Pressable>
                </>
);
  }
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
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 20,
    backgroundColor: '#EFF7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
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
  },
  })
  export { handleOpenCamera, handleOpenGallery,Createway };