import React,{ useEffect } from'react';
import { View ,Text,StyleSheet, Pressable } from'react-native';
import Arrow_back from "../assets/images/arrow-back.svg";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
const beforePublish = (photos:Object[]) => {
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
       <View>
{/* {
    photos.map((photo,index) => (
        <View key={index} style={{marginTop: 20,marginBottom: 20}}>
            <Text>{photo.title}</Text>
            <Text>{photo.description}</Text>
        </View>
    ))
} */}
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
    }
})