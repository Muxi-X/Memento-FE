import React,{ useEffect } from'react';
import { View ,Text,StyleSheet, Pressable, Image } from'react-native';
import Arrow_back from "../assets/images/arrow-back.svg";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { PhotoObject } from './api/interface';
const beforePublish = (photos:PhotoObject[]) => {
    const navigation = useNavigation();
      useEffect(() => {
        navigation.setOptions({
          headerShown: false,
        });
      }, []);
  return(
    <SafeAreaProvider style={styles.container}>
       <View style={styles.header}>
         <Pressable onPress={() => navigation.goBack()} style={{marginLeft: 20}}>
            <Arrow_back />
        </Pressable>
        <View style={styles.button1}>
            <Text>存草稿</Text>
        </View>
        <View  style={styles.button2}>
            <Text>发布</Text>
        </View>
       </View >
{
    photos.map((photo) => (
        <View key={photo.id} >
          <Image
            source={{ uri: photo.uri }}
            resizeMode="contain"
            // 调试用：打印加载状态
            onLoad={() => console.log(`图片 ${photo.fileName} 加载成功`)}
            onError={(e) => console.error(`图片 ${photo.fileName} 加载失败:`, e.nativeEvent.error)}
          />
          {/* 可选：显示文件名，方便调试 */}
          <View >
            <Text >{photo.fileName}</Text>
          </View>
        </View>
    ))
}

       <View>

       </View>
    </SafeAreaProvider>
  )
};

export default beforePublish;
const styles=StyleSheet.create({
    container:{
           flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    },
    header:{
        flexDirection: 'row',
        width: '100%',
        height: 50,
        backgroundColor: '#FFFFFF',
        justifyContent:'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    button1:{},
    button2:{},

})