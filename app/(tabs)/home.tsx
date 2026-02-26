
import {  StyleSheet,View,Text, Pressable,ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import React, { use } from'react';
import Edit from "../../assets/images/edit.svg"
import HomeCard from '../../components/homeCard';
const handleout = async() => {
  const router = useRouter();
  await SecureStore.deleteItemAsync("refresh_token");
  await SecureStore.deleteItemAsync("access_token");
  await SecureStore.deleteItemAsync("user_id");
  await SecureStore.deleteItemAsync("user_name");
  router.navigate("/signin");
}
export default function HomeScreen() {
  console.log("渲染了");
  
  return (
    <ScrollView >
    <SafeAreaView style={styles.container}>
      <View style={styles.touxiangcontainer}>
        <View style={styles.touxiang}></View>
          <Text style={styles.username}>用户名</Text>
          <Pressable onPress={()=>{console.log("换头像")}} style={styles.editkuang}>
            <Edit/>
            </Pressable>       
                <View style={styles.sumcontainer}>
        <View style={styles.sumitem}>
          <Text style={styles.sumnumber}>xxx</Text>
          <Text style={styles.sumlable}>官方作品</Text>
        </View>
         <View style={styles.sumitem}>
          <Text style={styles.sumnumber}>xxx</Text>
          <Text style={styles.sumlable}>自定义作品</Text>
        </View>
      </View>
      </View>
  <View style={styles.listheader}>
    <Text>自定义关键词</Text>
    <Pressable onPress={()=>{console.log("新建自定义关键词")}}>
      <Text style={{fontSize:12,color:"#999999"}}>+新建</Text>
    </Pressable>
  </View>
  <ScrollView>
    <HomeCard  hasAim={true}></HomeCard>
    <HomeCard hasAim={false}></HomeCard>
    <HomeCard hasAim={false}></HomeCard>
    <HomeCard hasAim={false}></HomeCard>
    <HomeCard hasAim={false}></HomeCard>
  </ScrollView>
      <Pressable onPress={handleout}>
        <Text > 退出登录</Text>
      </Pressable>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'column', 
  },
  touxiangcontainer:{
      position: 'relative',
    height:375,
    width:"100%",
    // backgroundColor: '#fdfdfd',
  },
  touxiang:{
    position: 'absolute',
    width: 100,
    height: 100,
    top:118,
    left:138,
    borderRadius: 50,
    backgroundColor: '#858181',

  },
  username:{
    position: 'absolute',
    top:225,
    left:158,
    fontSize:20,
    color:"#3D3D3D",
    fontWeight:"700",
    marginTop:7
  },
  editkuang:{
    position: 'absolute',
    top:190,
    left:213,
    backgroundColor:"#72B6FF",
    width:26,
    height:26,
    borderRadius:13,
    zIndex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sumcontainer:{
    height:100,
    width:327,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'center',
    gap:96,
    position: 'absolute',
    top:287,
    left:24,
  },
  sumitem:{},
  sumnumber:{
    fontSize:36,
    color:"#3D3D3D",
  },
  sumlable:{
    fontSize:14,
    color:"#3D3D3D"
  },
  listheader:{
    flexDirection:"row",
    alignItems: 'center',
    gap:180,
    marginTop:39,
  }
});
