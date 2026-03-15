import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import  Createway  from "./createway";
import { drawOfficialPrompt } from "@/app/api/keywords";
import { PromptWords } from "@/app/api/interface";
import usePromptStore from "@/app/stores/usePromptStore";

interface SmalltipProps {
  borderColor: string;
  textColor: string;
  tagText: string;
  tagColor: string;
  describeText: string;
  kind: PromptWords;
}
export default function Smalltip({
  borderColor,
  textColor,
  tagText,
  tagColor,
  describeText,
  kind
}: SmalltipProps) {
  const [detail, setDetail] = useState(false);
  const  [ideas, setIdeas]=useState("")
  const id=usePromptStore((state)=>state.keyword_id)
const getPromptWords= async()=>{
  
    const Words = await drawOfficialPrompt(id,kind);
    setIdeas(Words.data.content)
}
  return (
    <>
      <Pressable
        style={[
          styles.findkuang,
          {
            borderColor: borderColor,
            padding: 22,
          },
        ]}
        onPress={() => {setDetail(true)
          getPromptWords()}
        }
      >
        <Text style={[styles.findtext]}>{tagText}</Text>
        <Text style={[styles.findsmalltext, { color: textColor }]}>
          {describeText}
        </Text>
      </Pressable>
      <Modal
        animationType="fade"
        transparent={true}
        visible={detail}
        onRequestClose={() => setDetail(false)}
      >
        <Pressable style={styles.modalMask} onPress={() => setDetail(false)}>
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}

          >
            <View style={[styles.findkuang, { borderColor: borderColor }]}>
              <Text style={[styles.ideatext, { color: textColor }]}>
                {ideas}
              </Text>
              <Text style={[styles.smalltext, { color: borderColor }]}>
                {tagText}
              </Text>
            </View>
            <Text style={styles.modalTitle}>有灵感了？马上试试?</Text>
            <Createway />
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
    height: 429,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
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
    position: "relative",
  },
  smalltext: {
    fontSize: 16,
    fontFamily: "思源黑体",
    position: "absolute",
    right: 15,
    top: 65,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 20,
  },
  ideatext: {
    fontSize: 22,
    fontWeight: "400",
    padding :10
  },
  findtext: {
    color: "#333333",
    fontSize: 22,
    fontWeight: "400",
  },
  findsmalltext: {
    fontSize: 14,
    fontWeight: "400",
    marginTop: 4,
  },
});
