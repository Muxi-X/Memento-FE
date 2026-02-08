import { Link } from "expo-router";
import React, { useState } from "react";
import { Text, View, StyleSheet, Pressable, Modal } from "react-native";
import Idea from "../assets/images/idea.svg";
import Smalltip from "./tipsmall";
export default function KeyCard() {
  const [tipstate, setTipstate] = useState(false);
  return (
    <View style={styles.card}>
      <View style={styles.contentBox}>
        <Text style={styles.chineseText}>安静</Text>
        <Text style={styles.englishText}>quiet</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.statText}>已有xxx人参与今日创作</Text>
        <Link href={"/find"} asChild>
          <Text style={styles.linkText}>查看作品&gt;</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: 327,
    height: 256,
    borderRadius: 20,
    position: "relative",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(8px)",
    // WebkitBackdropFilter: "blur(8px)", // 兼容iOS
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
  findIcon: {
    position: "absolute",
    top: 12,
    bottom: 222,
    right: 19.26,
  },
  findkuang: {
    display: "flex",
    flexDirection: "column",
    width: 335,
    height: 100,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: "center",
    marginBottom: 20,
    paddingLeft: 22,
    gap: 6,
  },
  findtext: {
    fontSize: 22,
    fontWeight: "400",
    color: "#333333",
  },
  findsmalltext: {
    fontSize: 14,
    fontWeight: "400",
    marginTop: 4,
  },
  contentBox: {
    width: "100%",
    height: 220,
    alignItems: "center",
    top: 76,
  },
  chineseText: {
    fontSize: 48,
    fontWeight: "400",
    color: "#333333",
    marginBottom: 8,
  },
  englishText: {
    fontFamily: "Arial",
    fontSize: 22,
    color: "#666666",
    marginBottom: 8,
  },

  questionIcon: {
    position: "absolute",
  },
  questionText: {
    fontSize: 14,
    color: "#999999",
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    opacity: 1,
    width: "100%",
    marginLeft: 18,
    marginBottom: 13,
    borderRadius: 20,
  },

  statText: {
    fontSize: 12,
    color: "#8EB7E7",
    paddingRight: 106,
  },
  linkText: {
    fontSize: 12,
    fontWeight: "400", //字重没有350
    color: "#666666",
  },
});
