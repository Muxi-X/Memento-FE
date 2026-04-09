import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import * as Progress from "react-native-progress";
import ArrowRgiht from "../assets/images/arrow-right.svg";
import CoverImage from "../assets/images/baseCover.svg";
import { Notificover } from "@/app/api/interface";
import { router } from "expo-router";
type Props = {
  hasAim: boolean;
  target: number;
  progress: number;
  title: string;
  cover?: Notificover | null;
  keyword_id:string;
};
export default function HomeCard(props: Props) {
  return (
    <View style={styles.card}>
      {props.cover  ? (
        <Image
          source={{ uri: props.cover?.variants.square_small.url }}
          style={styles.Imagedata}
        />
      ) : (
        <CoverImage></CoverImage>
      )}

      <Text style={{ fontSize: 18, color: "#3D3D3D", marginLeft: 12 }}>
        {props.title}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          position: "absolute",
          top: 33,
          right: 21,
        }}
      >
        <Text style={{ fontSize: 12, color: "#666666", marginLeft: 116 }}>
          {props.progress}张作品
        </Text>
        <Pressable
          style={styles.detailArrow}
          onPress={() => {
            router.navigate(
              {
                pathname: "/customPage",
                params: { keyword: props.title,
                  keyword_id:props.keyword_id
                 }
              }
            )
          }}
        >
          <ArrowRgiht></ArrowRgiht>
        </Pressable>
      </View>
      {props.hasAim && (
        <Progress.Bar
          style={styles.progressBar}
          height={8}
          width={100}
          progress={props.progress / props.target}
          borderWidth={0}
          color="#72B6FF"
          unfilledColor="#EEEEEE"
        ></Progress.Bar>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    width: 327,
    height: 80,
    borderRadius: 20,
    paddingLeft: 17,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    position: "relative",
  },
  Imagedata: {
    width: 50,
    height: 50,
    borderRadius: 12,
    overflow: "hidden",
  },

  detailArrow: {
    width: 20,
    height: 20,
    borderRadius: 6,
    marginLeft: 12,
    backgroundColor: "#F9F9F9",
    justifyContent: "center",
    alignItems: "center",
  },
  progressBar: {
    position: "absolute",
    top: 50,
    left: 79,
  },
});
