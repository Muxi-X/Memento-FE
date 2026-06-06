import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import Arrowback from "../assets/images/arrow-back.svg";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function PrivacyAgreement() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <SafeAreaProvider style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Arrowback />
        </Pressable>
        <Text style={styles.headerTitle}>隐私协议</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>隐私政策</Text>
        <Text style={styles.date}>生效日期：2026年06月06日</Text>
        <Text style={styles.date}>更新日期：2026年06月06日</Text>

        <Text style={styles.paragraph}>
          此行（Memento）非常重视你的个人信息与隐私保护。本隐私政策将向你说明我们如何收集、使用、存储和保护你的个人信息。
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>第一条｜我们收集的信息</Text>
        <Text >1.1 你主动提供的信息</Text>
        <Text style={styles.paragraph}>
          - 注册或登录信息（如账号标识）
        </Text>
        <Text style={styles.paragraph}>
          - 你上传的内容（照片、文字、语音等）
        </Text>
        
        <Text >1.2 使用过程中产生的信息</Text>
        <Text style={styles.paragraph}>
          - 设备信息（设备型号、操作系统版本）
        </Text>
        <Text style={styles.paragraph}>
          - 基本使用行为信息（用于产品优化与安全）
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>第二条｜信息使用目的</Text>
        <Text style={styles.paragraph}>
          我们仅在以下目的范围内使用你的信息：
        </Text>
        <Text style={styles.paragraph}>
          1. 提供与维护核心功能
        </Text>
        <Text style={styles.paragraph}>
          2. 内容展示与回顾
        </Text>
        <Text style={styles.paragraph}>
          3. 产品体验优化
        </Text>
        <Text style={styles.paragraph}>
          4. 系统安全与风险控制
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>第三条｜公共内容说明</Text>
        <Text style={styles.paragraph}>
          1. 你选择参与公共浏览的内容，将在对应关键词下对其他用户可见。
        </Text>
        <Text style={styles.paragraph}>
          2. 公共展示不包含你的敏感个人信息。
        </Text>
        <Text style={styles.paragraph}>
          3. 你可随时调整内容的公开状态。
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>第四条｜信息的存储与保护</Text>
        <Text style={styles.paragraph}>
          1. 我们采取合理的技术与管理措施保护你的信息安全。
        </Text>
        <Text style={styles.paragraph}>
          2. 信息仅在实现产品功能所必需的期限内保存。
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>第五条｜信息共享与披露</Text>
        <Text style={styles.paragraph}>
          除以下情况外，我们不会向第三方披露你的个人信息：
        </Text>
        <Text style={styles.paragraph}>
          1. 获得你的明确授权
        </Text>
        <Text style={styles.paragraph}>
          2. 法律法规要求
        </Text>
        <Text style={styles.paragraph}>
          3. 为维护系统安全的必要情况
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>第六条｜你的权利</Text>
        <Text style={styles.paragraph}>
          你有权：
        </Text>
        <Text style={styles.paragraph}>
          - 访问、更正你的个人信息
        </Text>
        <Text style={styles.paragraph}>
          - 删除你创建的内容
        </Text>
        <Text style={styles.paragraph}>
          - 注销账号（注销后信息将依法处理）
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>第七条｜未成年人保护</Text>
        <Text style={styles.paragraph}>
          如你为未成年人，请在监护人指导下使用本产品。
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>第八条｜政策更新</Text>
        <Text style={styles.paragraph}>
          本隐私政策如有更新，将在产品内进行提示。
        </Text>
        <Text style={styles.paragraph}>
          继续使用即表示你同意更新后的政策内容。
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>第九条｜联系我们</Text>
        <Text style={styles.paragraph}>
          如你对隐私政策有任何疑问，可通过产品内反馈渠道联系我们。
        </Text>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 100,
    width: "100%",
    alignItems: "center",
    paddingTop: 20,
    justifyContent: "center",
    position: "relative",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backBtn: {
    position: "absolute",
    height: 100,
    width: 80,
    alignContent: "center",
    justifyContent: "center",
    left: 20,
    padding: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    marginTop: 8,
  },
  paragraph: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 16,
  },
  bottomPadding: {
    height: 40,
  },
});
