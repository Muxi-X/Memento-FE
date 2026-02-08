import React, { useState } from "react";
import { Pressable, StyleSheet, Modal } from "react-native";
import  IdeaIcon  from '../assets/images/idea.svg';
import Smalltip from "./tipsmall";
 export const  Idea = () => {
    const [tipstate, setTipstate]=useState(false);
  return(
    <>
    <Pressable style={styles.findIcon} onPress={() => setTipstate(true)}>
        <IdeaIcon width={24} height={26}></IdeaIcon>
      </Pressable>
            <Modal
              animationType="slide"
              transparent={true}
              visible={tipstate}
              onRequestClose={() => setTipstate(false)}
            >
              <Pressable style={styles.modalMask} onPress={() => setTipstate(false)}>
                <Pressable
                  style={styles.modalContent}
                  onPress={(e) => e.stopPropagation()}
                >
                  <Smalltip
                    borderColor="#D2E1FF"
                    textColor="#72B6FF"
                    tagText="直觉"
                    tagColor="#D2E1FF"
                    describeText="基于第一感受与当下情绪"
                  ></Smalltip>
                  <Smalltip
                    borderColor="#FFCCD2"
                    textColor="#FFA9BF"
                    tagText="空间"
                    tagColor="#FFCCD2"
                    describeText="关注个体在空间中的位置与方向"
                  ></Smalltip>
                  <Smalltip
                    borderColor="#DCCFFD"
                    textColor="#CBA9FF"
                    tagText="观念"
                    tagColor="#DCCFFD"
                    describeText="围绕意义、主题与表达"
                  ></Smalltip>
                </Pressable>
              </Pressable>
            </Modal></>
      
  )
};
const styles = StyleSheet.create({
  findIcon: {
   justifyContent: "center",
    alignItems: "center",
    width: 26,
    height: 26,
  },
   modalMask: {
    flex: 1,
    backgroundColor: "rgba(21, 24, 30, 0.2)",
    justifyContent: "flex-end",
  },
  // 抽屉内容
  modalContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: 429,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
});