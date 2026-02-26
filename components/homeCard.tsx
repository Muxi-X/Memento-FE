import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import ArrowRgiht from "../assets/images/arrow-right.svg";
type Props = {
  hasAim: boolean;
};
export default function HomeCard(props: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.Imagedata}></View>
      <Text style={{ fontSize: 18, color: "#3D3D3D", marginLeft: 12 }}>
        关键
      </Text>
      <Text style={{ fontSize: 12, color: "#666666", marginLeft: 116 }}>
        x张作品
      </Text>
      <Pressable
        style={styles.detailArrow}
        onPress={() => {
          console.log("detail");
        }}
      >
        <ArrowRgiht></ArrowRgiht>
      </Pressable>
      {/* {props.hasAim && (
        <ProgressView
          progress={0.5} // 0-1 之间的数值
          progressTintColor="#0066FF" // 进度条颜色
          trackTintColor="#E5E7EB" // 背景轨道颜色
          style={styles.progressBar}
        />
      )} */}
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
  },
  Imagedata: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#ff0000",
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
    height: 8,
    width: "100%",
    borderRadius: 4,
  },
});
