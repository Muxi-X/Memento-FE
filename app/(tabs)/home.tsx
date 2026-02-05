
import {  StyleSheet,View,Text, Pressable } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
const router = useRouter();
const handleout = async() => {
  await SecureStore.deleteItemAsync("refresh_token");
  await SecureStore.deleteItemAsync("access_token");
  router.navigate("/signin");
}
export default function HomeScreen() {
  console.log("渲染了");
  
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.touxiang}></View>
      </View>
      <Pressable onPress={handleout}>
        <Text > 退出登录</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  touxiang:{
    position: 'absolute',
    top:118,
    left:138,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#858181',
  }
});
