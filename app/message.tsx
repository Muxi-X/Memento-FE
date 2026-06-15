import { useRouter } from 'expo-router';
import { View, StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Arrowback from '../assets/images/arrow-back.svg';
import MessageTip from '@/components/messageTip';
import { useCallback, useEffect, useState } from 'react';
import { getNotificationslist, markNotificationsRead } from './api/me';
import { notfiItem } from './api/interface';

export default function Message() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<notfiItem[]>([]);
  const getNotifications = useCallback(async () => {
    const res = await getNotificationslist();
    setNotifications(res.data.items);
  }, []);
  const markRead = useCallback(async () => {
    try {
      const res = await markNotificationsRead();
      if (res.status === 204) {
        console.log('标记已读成功');
      } else {
        console.log('标记已读失败', res.status);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);
  useEffect(() => {
    getNotifications();
    markRead();
  }, [getNotifications, markRead]);
  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            router.back();
          }}
          style={styles.arrowback}
        >
          <Arrowback />
        </Pressable>
        <Text style={styles.headertext}>互动</Text>
      </View>
      <ScrollView style={styles.messagelist}>
        {notifications &&
          notifications.map((item, index) => {
            return <MessageTip key={index} {...item} />;
          })}
      </ScrollView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    height: 44,
    width: '100%',
    marginTop: 44,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#fff',
  },
  arrowback: {
    left: 26,
    position: 'absolute',
  },
  headertext: {
    fontSize: 16,
    fontWeight: 500,
  },
  messagelist: {
    backgroundColor: '#FBFBFD',
    width: '100%',
  },
});
