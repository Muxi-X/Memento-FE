import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Arrowback from '../assets/images/arrow-back.svg';

export default function UserAgreement() {
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
        <Text style={styles.headerTitle}>用户协议</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>一、《用户协议》</Text>
        <Text style={styles.date}>生效日期：2026年06月06日</Text>
        <Text style={styles.date}>更新日期：2026年06月06日</Text>

        <Text style={styles.paragraph}>
          欢迎你使用 此行（Memento）（以下简称&quot;本产品&quot;）。
        </Text>
        <Text style={styles.paragraph}>
          在使用本产品前，请你仔细阅读并充分理解本《用户协议》（以下简称&quot;本协议&quot;）。
        </Text>
        <Text style={styles.paragraph}>
          当你开始使用本产品，即视为你已阅读并同意本协议的全部内容。
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>第一条｜定义说明</Text>
        <Text style={styles.paragraph}>
          1. 本产品：指&quot;此行（Memento）&quot;及其相关功能、服务与技术支持。
        </Text>
        <Text style={styles.paragraph}>2. 用户：指注册、登录或以其他方式使用本产品的个人。</Text>
        <Text style={styles.paragraph}>
          3. 用户内容：指用户在本产品中上传、发布或生成的内容，包括但不限于照片、文字、语音等。
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>第二条｜服务内容</Text>
        <Text style={styles.paragraph}>
          1. 本产品是一款以关键词为核心的拍摄与记录应用，用于引导用户进行观察、创作与回顾。
        </Text>
        <Text style={styles.paragraph}>
          2. 本产品部分功能支持用户在特定关键词下浏览其他用户的公开内容。
        </Text>
        <Text style={styles.paragraph}>
          3. 本产品不保证所有功能永久可用，具体服务内容以实际提供为准。
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>第三条｜账号与使用规范</Text>
        <Text style={styles.paragraph}>1. 用户可选择注册账号以使用完整功能。</Text>
        <Text style={styles.paragraph}>2. 用户应保证所提交信息的真实性、合法性和有效性。</Text>
        <Text style={styles.paragraph}>
          3. 用户应妥善保管账号及登录凭证，因账号使用产生的行为后果由用户自行承担。
        </Text>
        <Text style={styles.paragraph}>4. 如发现账号存在异常使用，用户应及时通知我们。</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>第四条｜用户内容与权利</Text>
        <Text style={styles.subTitle}>4.1 用户权利</Text>
        <Text style={styles.paragraph}>1. 用户对其上传或创建的内容依法享有相应权利。</Text>
        <Text style={styles.paragraph}>2. 用户保证其上传内容不侵犯任何第三方的合法权益。</Text>

        <Text style={styles.subTitle}>4.2 使用授权</Text>
        <Text style={styles.paragraph}>
          为实现产品功能，用户同意授予本产品在以下范围内使用其内容的权利：
        </Text>
        <Text style={styles.paragraph}>- 存储、展示、整理、回顾</Text>
        <Text style={styles.paragraph}>- 在产品功能范围内进行必要的分发与呈现</Text>
        <Text style={styles.paragraph}>该授权 不具有排他性、不可转让、不可再授权。</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>第五条｜内容规范</Text>
        <Text style={styles.paragraph}>用户不得上传、发布或传播以下内容：</Text>
        <Text style={styles.paragraph}>1. 违反法律法规或公序良俗的内容</Text>
        <Text style={styles.paragraph}>2. 侵犯他人隐私权、肖像权、著作权等合法权益的内容</Text>
        <Text style={styles.paragraph}>3. 含有恶意、歧视、暴力、骚扰、误导性信息的内容</Text>
        <Text style={styles.paragraph}>4. 用于商业推广、刷量或其他不当用途的内容</Text>
        <Text style={styles.paragraph}>
          如用户违反上述规定，本产品有权依法采取删除内容、限制功能、暂停或终止账号等措施。
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>第六条｜公共浏览与展示机制</Text>
        <Text style={styles.paragraph}>
          1. 在官方关键词下，部分用户内容可能被展示于公共浏览区域。
        </Text>
        <Text style={styles.paragraph}>
          2. 公共浏览的目的在于呈现不同用户对同一关键词的理解方式，不构成排名、评价或推荐。
        </Text>
        <Text style={styles.paragraph}>3. 用户可在产品设置中管理其内容是否参与公共展示。</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>第七条｜服务调整与中断</Text>
        <Text style={styles.paragraph}>1. 本产品可能根据运营情况对功能进行更新、调整或中断。</Text>
        <Text style={styles.paragraph}>2. 如涉及重大变更，将通过合理方式进行提示。</Text>
        <Text style={styles.paragraph}>
          3. 因不可抗力或技术原因导致的服务中断，本产品不承担由此产生的责任。
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>第八条｜责任限制</Text>
        <Text style={styles.paragraph}>
          1. 本产品按&quot;现状&quot;提供服务，不对服务的连续性或完全无误作出保证。
        </Text>
        <Text style={styles.paragraph}>
          2. 因用户自身行为、设备或网络原因造成的损失，由用户自行承担。
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>第九条｜协议变更</Text>
        <Text style={styles.paragraph}>1. 本协议可能根据法律法规或产品调整进行更新。</Text>
        <Text style={styles.paragraph}>
          2. 更新后的协议将在产品内公示，继续使用即视为接受更新内容。
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>第十条｜适用法律与争议解决</Text>
        <Text style={styles.paragraph}>本协议的订立、执行与解释适用中华人民共和国法律。</Text>
        <Text style={styles.paragraph}>如发生争议，应优先协商解决；协商不成的，依法处理。</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>第十一条｜联系我们</Text>
        <Text style={styles.paragraph}>如你对本协议有任何疑问，可通过产品内反馈渠道联系我们。</Text>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    position: 'absolute',
    height: 100,
    width: 80,
    alignContent: 'center',
    justifyContent: 'center',
    left: 20,
    padding: 5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  bottomPadding: {
    height: 40,
  },
});
