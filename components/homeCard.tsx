import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import * as Progress from 'react-native-progress';
import ArrowRgiht from "../assets/images/arrow-right.svg";
import CoverImageNull  from "../assets/images/coverImagenull.svg";
import { coverImage } from "@/app/api/interface";
type Props = {
  hasAim: boolean;
  target: number;
  progress: number;
  title: string;
  cover: coverImage|null;
};
export default function HomeCard(props: Props) {
  return (
    <View style={styles.card}>
      {      props.cover!==null ?
      <View style={styles.Imagedata}>

  <Image source={{uri:props.cover.variants.card_4x3.url}}/></View>
:
  <View style={[styles.Imagedata ,{backgroundColor:"#EFEFEF",alignItems:"center",justifyContent:"center"
  }]}>
    <Text style={{ fontSize: 36, color: "#666666",  }}>?</Text>
    </View>}
      
      
      <Text style={{ fontSize: 18, color: "#3D3D3D", marginLeft: 12 }}>
        {props.title}
      </Text>
     <View style={{flexDirection: "row",alignItems: "center",position:"absolute",top:33,right:21}}>
       <Text style={{ fontSize: 12, color: "#666666", marginLeft: 116 }}>
        {props.progress}张作品
      </Text>
      <Pressable
        style={styles.detailArrow}
        onPress={() => {
          console.log("detail");
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
        progress={props.progress/props.target}
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
    position:"absolute",
    top:50,
    left:79
  },
});
