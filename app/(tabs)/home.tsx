import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  ImageBackground,
  Image,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import Edit from "../../assets/images/edit.svg";
import Message from "../../assets/images/message.svg";
import Configure from "../../assets/images/configure.svg";
import HomeCard from "../../components/homeCard";
import Goodmm from "../../assets/images/goodmmm.svg";
import { getMedata } from "../api/me";
import { mydataItem } from "../api/interface";
import { useMyStore } from "../stores/authstore";
import NewCreate from "@/components/newCreate";
import Touxiang from "../../assets/images/basetouxaing.svg";
import { getCustomKeywordList } from "../api/me";
export default function HomeScreen() {

  const router = useRouter();
  const [mask, setMask] = useState(false);
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
      const res = await getMedata();
      setMydata(res.data);
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
const getCustomlist=async()=>{
const res=await getCustomKeywordList();
return res.data;
}
  return (
    <ScrollView>
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
          {avatar_url ? (
            <Image style={styles.touxiang} source={{ uri: avatar_url }}></Image>
          ) : (
            <Touxiang style={styles.touxiang}></Touxiang>
          )}

          <Text style={styles.username}>{nickname}</Text>
          <Pressable
            onPress={() => {
              console.log("换头像");
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
        <ScrollView>
          {custom_keywords.map((item, index) => {
            let Aim = false;
            if (item.target_image_count > 0) {
              Aim = true;
            }
            return (
              <HomeCard
                key={item.id}
                hasAim={Aim}
                target={item.target_image_count}
                progress={item.my_image_count}
                title={item.text}
                cover={item.cover_image}
              ></HomeCard>
            );
          })}
        </ScrollView>
        <Goodmm style={styles.Goodmm}></Goodmm>
      </View>
    </ScrollView>
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
    flex: 1,
    width: 100,
    height: 100,
    top: 118,
    borderRadius: "50%",
    overflow: "hidden",
  },
  username: {
    top: 120,
    // left: 158,
    fontSize: 20,
    color: "#3D3D3D",
    fontWeight: "700",
    marginTop: 7,
  },
  editkuang: {
    position: "absolute",
    top: 180,
    left: 210,
    backgroundColor: "#72B6FF",
    width: 26,
    height: 26,
    borderRadius: 13,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    width: 327,
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
    width: 163,
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
    gap: 180,
    marginTop: 39,
  },
  Goodmm: {
    width: 150,
    height: 150,
    position: "absolute",
    left: 214,
    top: 195,
    zIndex: 1,
  },
});
