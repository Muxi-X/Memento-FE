import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  StyleSheet,
} from "react-native";
import * as SecureStore from "expo-secure-store";

import { addCustomKeyword } from "../app/api/me";
export default function NewCreate() {
  const [mask, setMask] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [target, setTarget] = useState<number | string>("无");
  const presetOptions = [7, 30, 52, 365, "无"];
  const [currentIdx, setCurrentIdx] = useState(4); // 默认选中"无"
  const MAX_KEYWORD_LENGTH = 10; // 关键词最大字数

  // 处理关键词输入（限制10字）
  const handleKeywordChange = (text: string) => {
    // 只保留前10个字符，超出部分截断
    if (text.length <= MAX_KEYWORD_LENGTH) {
      setKeyword(text);
    }
  };

  const handleInputChange = (text: string) => {
    const num = text.replace(/[^0-9]/g, "");
    setTarget(num || "无");
    const matchIdx = presetOptions.indexOf(num ? Number(num) : "无");
    if (matchIdx !== -1) setCurrentIdx(matchIdx);
  };

  const handleLeft = () => {
    const newIdx = currentIdx > 0 ? currentIdx - 1 : presetOptions.length - 1;
    setCurrentIdx(newIdx);
    setTarget(presetOptions[newIdx]);
  };

  const handleRight = () => {
    const newIdx = currentIdx < presetOptions.length - 1 ? currentIdx + 1 : 0;
    setCurrentIdx(newIdx);
    setTarget(presetOptions[newIdx]);
  };

  const handleConfirm = async() => {
    if(keyword.trim()===""){
      alert("关键词不能为空");
      return;
    }
    try {      
      await addCustomKeyword(keyword, typeof target === "number" ? target : null);
      alert("添加成功");
      setMask(false);
    } catch (error) {
      console.error("添加失败：", error);
      alert("添加失败，请重试");
    }
  };
  const remainingLength = MAX_KEYWORD_LENGTH - keyword.length;

  return (
    <>
      <Pressable onPress={() => setMask(true)}>
        <Text style={{ fontSize: 12, color: "#999999" }}>+新建</Text>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={mask}
        onRequestClose={() => setMask(false)}
      >
        <Pressable style={styles.modalMask} onPress={() => setMask(false)}>
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <Pressable style={styles.button} onPress={() => { setMask(false) }}>
              <Text style={{ color: "#333333", fontSize: 14 }}>取消</Text>
            </Pressable>
            <Pressable style={[styles.button, { left: 323 }]} onPress={handleConfirm}>
              <Text style={{ color: "#333333", fontSize: 14 }}>确认</Text>
            </Pressable>
            <Text style={{ color: "#333333", fontSize: 16, fontWeight: 500, marginTop: 52 }}>自定义关键词</Text>
            <View style={styles.keywords}>
              <TextInput
                placeholder="请输入关键词"
                value={keyword}
                onChangeText={handleKeywordChange} 
                maxLength={MAX_KEYWORD_LENGTH} 
                placeholderTextColor="#999999"
              ></TextInput>
              <Text style={{ color: "#999999", fontSize: 14,position: "absolute", right: 15  }}>
                {remainingLength}
              </Text>
            </View>
            <View style={styles.line}></View>
            <View style={styles.target}>
              <Text>目标张数</Text>
              <Text style={{ color: "#72B6FF", marginRight: 157, marginLeft: 10 }}>(可选)</Text>
              <Pressable onPress={handleLeft}><Text>&lt;</Text></Pressable>
              <View style={styles.targetInput}>
                <TextInput
                  style={{ color: "#999999", fontSize: 14 }}
                  value={target.toString()}
                  onChangeText={handleInputChange}
                  keyboardType="numeric"
                  placeholder="无"
                  placeholderTextColor="#999999"
                ></TextInput>
              </View>
              <Pressable onPress={handleRight}><Text>&gt;</Text></Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
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
    height: 263,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    position: "relative",
  },
  button: {
    position: "absolute",
    top: 17,
    left: 24,

  },
  keywords: {
    flexDirection: "row",
    marginTop: 24,
    width: 327,
    paddingLeft: 12,
    position: "relative",
  },
  line: {
    width: 327,
    height: 0,
    borderColor: "#D8D8D8",
    borderTopWidth: 1,
    marginTop: 10,
  },
  target: {
    flexDirection: "row",
    marginTop: 33
  },
  targetInput: {
    alignItems: "center",
    justifyContent: "center",
    height: 20,
    marginHorizontal: 5,
    borderBottomColor: "#D8D8D8",
    borderBottomWidth: 1,
  },
});