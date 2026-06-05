import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ImageBackground,
  Image,
  FlatList,
  RefreshControl,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import Edit from "../../assets/images/edit.svg";
import Message from "../../assets/images/message.svg";
import Configure from "../../assets/images/configure.svg";
import HomeCard from "../../components/homeCard";
import Goodmm from "../../assets/images/goodmmm.svg";
import { mydataItem } from "../api/interface";
import { useMyStore } from "../stores/authstore";
import NewCreate from "@/components/newCreate";
import Touxiang from "../../assets/images/baseTouxiang.svg";
import { getCustomKeywordList,getMedata } from "../api/me";
import * as SecureStore from "expo-secure-store";
const { width: screenWidth } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const [mydata, setMydata] = useState<mydataItem>({
    nickname: "",
    avatar_url: "",
    official_image_count: 0,
    custom_image_count: 0,
    unread_notification_count: 0,
    custom_keywords: [],
  });
  const setNickname = useMyStore((state) => state.setNickname);

  useEffect(() => {
    const getMydata = async () => {
      try {
        const token = await SecureStore.getItemAsync("access_token");
        if (token !== null) {
          const res = await getMedata();
          setMydata(res.data);
        } else {
          router.replace("/signin");
        }
      } catch (e) {
        console.log(e);
      }
    };
    getMydata();
  }, []);
  if (mydata === null) {
    return null;
  }
  const {
    nickname,
    avatar_url,
    official_image_count,
    custom_image_count,
    unread_notification_count,
    custom_keywords,
  } = mydata;
  setNickname(nickname);
  const onRefresh = async () => {
    setRefreshing(true);
    await getCustomKeywordList();
    setRefreshing(false);
  };
  return (
    <View>
      <View style={styles.container}>
        <Pressable
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
          source={{ uri: avatar_url }}
          imageStyle={styles.backgroundImageStyle}
        >
          <View style={styles.touxiang}>
            {avatar_url ? (
              <Image
                style={{ width: "100%", height: "100%" }}
                source={{ uri: avatar_url }}
              ></Image>
            ) : (
              <Touxiang style={{ width: "100%", height: " 100%" }}></Touxiang>
            )}
          </View>

          <Text style={styles.username}>{nickname}</Text>
          <Pressable
            onPress={() => {
              router.navigate("/setAuthdata")
            }}
            style={styles.editkuang}
          >
            <Edit />
          </Pressable>
          <View style={styles.sumcontainer}>
            <View style={styles.sumitem}>
              <Text style={styles.sumnumber}>{official_image_count}</Text>
              <Text style={styles.sumlable}>官方作品</Text>
            </View>
            <View style={styles.fengeline}></View>
            <View style={styles.sumitem}>
              <Text style={styles.sumnumber}>{custom_image_count}</Text>
              <Text style={styles.sumlable}>自定义作品</Text>
            </View>
          </View>
        </ImageBackground>
        <View style={styles.listheader}>
          <Text>自定义关键词</Text>
          <NewCreate></NewCreate>
        </View>
        <FlatList
          data={custom_keywords}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            let hasAim = item.target_image_count > 0;
            return (
              <HomeCard
                keyword_id={item.id}
                hasAim={hasAim}
                target={item.target_image_count}
                progress={item.my_image_count}
                title={item.text}
                cover={item.cover_image}
              />
            );
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#72B6FF"]}
              tintColor="#72B6FF"
              title="正在刷新..."
              titleColor="#999"
            />
          }
        />
        {/* <Goodmm style={styles.Goodmm}></Goodmm> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "column",
    position: "relative",
  },
  ConfigureIcon: {
    width: 36,
    height: 36,
    backgroundColor: "#ffffff",
    position: "absolute",
    top: 54,
    right: 26,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  chatnum: {
    width: 16,
    height: 16,
    position: "absolute",
    backgroundColor: "#FE585B",
    top: 53,
    right: 69,
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  numtext: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: 700,
  },
  touxiangcontainer: {
    position: "relative",
    height: 375,
    width: "100%",
    zIndex: -1,
    alignItems: "center",
  },
  backgroundImageStyle: {
    opacity: 0.25,
  },
  touxiang: {
    width: 100,
    height: 100,
    top: 118,
    borderRadius: "50%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  username: {
    top: 120,
    fontSize: 20,
    color: "#3D3D3D",
    fontWeight: "700",
    marginTop: 7,
  },
  editkuang: {
    backgroundColor: "#72B6FF",
    width: 26,
    height: 26,
    borderRadius: 13,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 60,
    marginTop: 60,
    shadowColor:"#000",
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
  },
  goodmm: {
    width: 150,
    height: 150,
    position: "absolute",
    top: 198,
    right: 11,
    backgroundColor: "#ffffff",
  },
  sumcontainer: {
    height: 100,
    width: screenWidth - 48,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 287,
    left: 24,
    zIndex: 2,
  },
  sumitem: {
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    height: 120,
  },
  fengeline: {
    position: "absolute",
    width: 46,
    height: 0,
    transform: [{ rotate: "90deg" }],
    borderColor: "#EFEFEF",
    borderTopWidth: 1.4,
  },
  sumnumber: {
    fontSize: 36,
    color: "#3D3D3D",
  },
  sumlable: {
    fontSize: 14,
    color: "#3D3D3D",
  },
  listheader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 39,
    paddingHorizontal: 37,
  },
  // Goodmm: {
  //   width: 150,
  //   height: 150,
  //   position: "absolute",
  //   left: 214,
  //   top: 195,
  //   zIndex: 1,
  // },
});
