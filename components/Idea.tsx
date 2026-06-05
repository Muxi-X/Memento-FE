import { PromptWords } from "../app/api/interface";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Modal, View,Platform,StatusBar } from "react-native";
import IdeaIcon from "../assets/images/idea.svg";
import Smalltip from "./tipsmall";
import { GuideOverlay } from "./guideOverlay";

interface IdeaProps {
  isGuideMode?: boolean;   
  step?: number;           
  onNext?: () => void;    
  innerRef?: any;         
  targetLayout?: any;     
  setTargetLayout?: (layout: any) => void; // 用于回传测量结果的方法
}

export const Idea = ({
  isGuideMode = false,
  step = 0,
  onNext,
  innerRef,
  targetLayout,
  setTargetLayout,
}: IdeaProps) => {
  const [tipstate, setTipstate] = useState(false);
  const measureContent = () => {
    
    if (innerRef?.current && setTargetLayout) {
      setTimeout(() => {
        innerRef.current?.measureInWindow((x: number, y: number, w: number, h: number) => {
          let  finalY=y
          if(Platform.OS==="android")
          {const statusBarHeight = StatusBar.currentHeight || 0;
          finalY = y + statusBarHeight;}
          setTargetLayout({ x, y: finalY, w, h });
        });
      }, 100);
    }
  };
useEffect(() => {
  if (isGuideMode) {
    setTipstate(true); 
  } else if (step === 0 && tipstate) {
    setTipstate(false);
  }
}, [isGuideMode, step]);
  const handleClose = () => {
    if (isGuideMode) return;
    setTipstate(false);
  };

  return (
    <>
      <Pressable style={styles.findIcon} onPress={() => setTipstate(true)}>
        <IdeaIcon width={24} height={26} />
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={tipstate}
        onRequestClose={handleClose}
        onShow={() => {
          if (isGuideMode) {
            measureContent();
          }
        }}
      >
        <Pressable style={styles.modalMask} onPress={handleClose}>
          <Pressable
            ref={innerRef} 
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <Smalltip
              borderColor="#B7E0FE"
              textColor="#41A1FC"
              tagText="直觉"
              tagColor="#41A1FC"
              describeText="基于第一感受与当下情绪"
              kind={PromptWords.intuition}
            />

            <Smalltip
              borderColor="#FFCCD2"
              textColor="#FFA9BF"
              tagText="空间"
              tagColor="#FC9AA4"
              describeText="关注个体在空间中的位置与方向"
              kind={PromptWords.structure}
            />

            <Smalltip
              borderColor="#CFE9DC"
              textColor="#6DBD95"
              tagText="观念"
              tagColor="#6DBD95"
              describeText="围绕意义、主题与表达"
              kind={PromptWords.concept}
            />
          </Pressable>
        </Pressable>

        {isGuideMode && (
          <GuideOverlay
            visible={true}
            target={targetLayout}
            step={step}
            onNext={onNext!}
          />
        )}
      </Modal>
    </>
  );
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