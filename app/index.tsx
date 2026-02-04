import { Redirect } from 'expo-router';
export default function RootIndex() {
  // 直接重定向到 TabBar 的入口页面
  return <Redirect href="/(tabs)/today" />;
}