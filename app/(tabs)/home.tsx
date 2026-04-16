import React, { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

import Goodmm from "../../assets/images/goodmmm.svg";
import Configure from "../../assets/images/configure.svg";
import Edit from "../../assets/images/edit.svg";
import Message from "../../assets/images/message.svg";
import Touxiang from "../../assets/images/basetouxaing.svg";
import HomeCard from "../../components/homeCard";
import GuideOverlay from "../../components/guide/GuideOverlay";
import { GuideRect, GuideStep, GuideTargetKey } from "../../components/guide/types";
import NewCreate from "../../components/newCreate";
import { mydataItem } from "../api/interface";
import { getCustomKeywordList, getMedata } from "../api/me";
import { useMyStore } from "../stores/authstore";
import { useGuideStore } from "../stores/useGuideStore";

const GUIDE_STEPS: GuideStep[] = [
  {
    align: "right",
    description: "这里会展示你的消息提醒和系统通知，别错过刚送达的新内容。",
    key: "message",
    placement: "bottom",
    title: "查看消息",
  },
  {
    align: "center",
    description: "这里是你的个人主页概览，可以快速看到昵称、头像和作品累计情况。",
    key: "profile",
    placement: "bottom",
    title: "个人资料",
  },
  {
    align: "right",
    description: "想开始新的观察主题时，从这里创建你的自定义关键词。",
    key: "create",
    placement: "bottom",
    title: "新建关键词",
  },
  {
    align: "left",
    description: "创建完成后，关键词会出现在这里，点进去就能继续查看和记录作品。",
    fallbackKey: "create",
    key: "card",
    placement: "top",
    title: "查看作品",
  },
];

const INITIAL_MYDATA: mydataItem = {
  avatar_url: "",
  custom_image_count: 0,
  custom_keywords: [],
  nickname: "",
  official_image_count: 0,
  unread_notification_count: 0,
};

const isSameRect = (prev: GuideRect | null | undefined, next: GuideRect) => {
  if (!prev) {
    return false;
  }

  return (
    Math.abs(prev.x - next.x) < 1 &&
    Math.abs(prev.y - next.y) < 1 &&
    Math.abs(prev.width - next.width) < 1 &&
    Math.abs(prev.height - next.height) < 1
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const setNickname = useMyStore((state) => state.setNickname);
  const currentStep = useGuideStore((state) => state.currentStep);
  const hasHydrated = useGuideStore((state) => state.hasHydrated);
  const isFinished = useGuideStore((state) => state.isFinished);
  const nextStep = useGuideStore((state) => state.nextStep);
  const complete = useGuideStore((state) => state.complete);

  const [layouts, setLayouts] = useState<
    Partial<Record<GuideTargetKey, GuideRect | null>>
  >({});
  const [mydata, setMydata] = useState<mydataItem>(INITIAL_MYDATA);
  const [refreshing, setRefreshing] = useState(false);

  const messageRef = useRef<View | null>(null);
  const profileRef = useRef<View | null>(null);
  const createRef = useRef<View | null>(null);
  const cardRef = useRef<View | null>(null);

  const guideVisible = hasHydrated && !isFinished;

  const updateLayout = useEffectEvent((
    key: GuideTargetKey,
    ref: React.RefObject<View | null>,
  ) => {
    ref.current?.measureInWindow((x, y, width, height) => {
      if (!width || !height) {
        return;
      }

      const nextRect = { height, width, x, y };

      setLayouts((prev) => {
        if (isSameRect(prev[key], nextRect)) {
          return prev;
        }

        return {
          ...prev,
          [key]: nextRect,
        };
      });
    });
  });

  const measureTargets = useEffectEvent(() => {
    updateLayout("message", messageRef);
    updateLayout("profile", profileRef);
    updateLayout("create", createRef);
    updateLayout("card", cardRef);
  });

  useEffect(() => {
    const getMydata = async () => {
      try {
        const token = await SecureStore.getItemAsync("access_token");

        if (token === null) {
          router.replace("/signin");
          return;
        }

        const res = await getMedata();
        setMydata(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getMydata();
  }, [router]);

  useEffect(() => {
    setNickname(mydata.nickname);
  }, [mydata.nickname, setNickname]);

  useEffect(() => {
    if (!guideVisible) {
      return;
    }

    const timeoutId = setTimeout(() => {
      measureTargets();
    }, 220);

    return () => clearTimeout(timeoutId);
  }, [
    currentStep,
    guideVisible,
    mydata.avatar_url,
    mydata.custom_keywords.length,
    mydata.nickname,
    mydata.unread_notification_count,
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getCustomKeywordList();
    setRefreshing(false);
    setTimeout(() => {
      measureTargets();
    }, 180);
  };

  const {
    avatar_url,
    custom_image_count,
    custom_keywords,
    nickname,
    official_image_count,
    unread_notification_count,
  } = mydata;

  return (
    <View>
      <View style={styles.container}>
        <Pressable
          ref={messageRef}
          collapsable={false}
          onLayout={() => updateLayout("message", messageRef)}
          style={[styles.ConfigureIcon, { right: 74 }]}
          onPress={() => {
            router.navigate("/message");
          }}
        >
          <Message />
        </Pressable>

        {unread_notification_count > 0 && (
          <View style={styles.chatnum}>
            <Text style={styles.numtext}>
              {unread_notification_count > 99
                ? "99+"
                : unread_notification_count}
            </Text>
          </View>
        )}

        <Pressable
          style={styles.ConfigureIcon}
          onPress={() => {
            router.navigate("/configure");
          }}
        >
          <Configure />
        </Pressable>

        <ImageBackground
          style={styles.touxiangcontainer}
          source={avatar_url ? { uri: avatar_url } : undefined}
          imageStyle={styles.backgroundImageStyle}
        >
          {avatar_url ? (
            <Image style={styles.touxiang} source={{ uri: avatar_url }} />
          ) : (
            <Touxiang style={styles.touxiang} />
          )}

          <Text style={styles.username}>{nickname}</Text>
          <Pressable
            onPress={() => {
              console.log("edit profile");
            }}
            style={styles.editkuang}
          >
            <Edit />
          </Pressable>
          <View
            ref={profileRef}
            collapsable={false}
            onLayout={() => updateLayout("profile", profileRef)}
            style={styles.sumcontainer}
          >
            <View style={styles.sumitem}>
              <Text style={styles.sumnumber}>{official_image_count}</Text>
              <Text style={styles.sumlable}>官方作品</Text>
            </View>
            <View style={styles.fengeline} />
            <View style={styles.sumitem}>
              <Text style={styles.sumnumber}>{custom_image_count}</Text>
              <Text style={styles.sumlable}>自定义作品</Text>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.listheader}>
          <Text>自定义关键词</Text>
          <View
            ref={createRef}
            collapsable={false}
            onLayout={() => updateLayout("create", createRef)}
          >
            <NewCreate />
          </View>
        </View>

        <FlatList
          data={custom_keywords}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const card = (
              <HomeCard
                keyword_id={item.id}
                hasAim={item.target_image_count > 0}
                target={item.target_image_count}
                progress={item.my_image_count}
                title={item.text}
                cover={item.cover_image}
              />
            );

            if (index !== 0) {
              return card;
            }

            return (
              <View
                ref={cardRef}
                collapsable={false}
                onLayout={() => updateLayout("card", cardRef)}
              >
                {card}
              </View>
            );
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#72B6FF"]}
              tintColor="#72B6FF"
              title="正在刷新..."
              titleColor="#999999"
            />
          }
        />
        <Goodmm style={styles.Goodmm} />
      </View>

      <GuideOverlay
        currentStep={currentStep}
        layouts={layouts}
        onAdvance={() => {
          nextStep(GUIDE_STEPS.length);
        }}
        onClose={complete}
        steps={GUIDE_STEPS}
        visible={guideVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ConfigureIcon: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    elevation: 5,
    height: 36,
    justifyContent: "center",
    position: "absolute",
    right: 26,
    shadowColor: "#000000",
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    top: 54,
    width: 36,
  },
  Goodmm: {
    height: 150,
    left: 214,
    position: "absolute",
    top: 195,
    width: 150,
    zIndex: 1,
  },
  backgroundImageStyle: {
    opacity: 0.25,
  },
  chatnum: {
    alignItems: "center",
    backgroundColor: "#FE585B",
    borderRadius: 8,
    height: 16,
    justifyContent: "center",
    position: "absolute",
    right: 69,
    top: 53,
    width: 16,
  },
  container: {
    alignItems: "center",
    flexDirection: "column",
    position: "relative",
  },
  editkuang: {
    alignItems: "center",
    backgroundColor: "#72B6FF",
    borderRadius: 13,
    height: 26,
    justifyContent: "center",
    left: 210,
    position: "absolute",
    top: 180,
    width: 26,
    zIndex: 1,
  },
  fengeline: {
    borderColor: "#EFEFEF",
    borderTopWidth: 1.4,
    height: 0,
    position: "absolute",
    transform: [{ rotate: "90deg" }],
    width: 46,
  },
  listheader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 180,
    marginTop: 39,
  },
  numtext: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  sumcontainer: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    flexDirection: "row",
    height: 100,
    justifyContent: "center",
    left: 24,
    position: "absolute",
    top: 287,
    width: 327,
    zIndex: 2,
  },
  sumitem: {
    alignItems: "center",
    height: 120,
    justifyContent: "center",
    width: 163,
  },
  sumlable: {
    color: "#3D3D3D",
    fontSize: 14,
  },
  sumnumber: {
    color: "#3D3D3D",
    fontSize: 36,
  },
  touxiang: {
    borderRadius: 50,
    flex: 1,
    height: 100,
    overflow: "hidden",
    top: 118,
    width: 100,
  },
  touxiangcontainer: {
    alignItems: "center",
    height: 375,
    position: "relative",
    width: "100%",
    zIndex: -1,
  },
  username: {
    color: "#3D3D3D",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 7,
    top: 120,
  },
});
