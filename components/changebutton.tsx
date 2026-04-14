import { useNavigation } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFindStore } from "../app/stores/usePromptStore";
export default function ChangeButton() {
  const setsort = useFindStore((state) => state.setsort);
  const sort = useFindStore((state) => state.sort);
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setsort("random")}
        style={[
          styles.smallbutton,
          {
            backgroundColor: sort === "random" ? "#EEEEEE" : "#ffffff",
          },
        ]}
      >
        <Text style={styles.smallbuttonText}>随机</Text>
      </Pressable>
      <Pressable
        onPress={() => setsort("latest")}
        style={[
          styles.smallbutton,
          {
            backgroundColor: sort === "latest" ? "#EEEEEE" : "#ffffff",
          },
        ]}
      >
        <Text style={styles.smallbuttonText}>最新</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: 80,
    height: 30,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    shadowOpacity: 0.2,
    elevation: 4,
  },
  smallbutton: {
    width: 36,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    backgroundColor: "#EFEFEF",
  },
  smallbuttonText: {
    fontSize: 12,
    color: "#666666",
    borderRadius: 6,
  },
});
export function ChangeButton2() {
  const setsort2 = useFindStore((state) => state.setsort2);
  const sort2 = useFindStore((state) => state.sort2);
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setsort2("me")}
        style={[
          styles.smallbutton,
          {
            backgroundColor: sort2 === "me" ? "#EEEEEE" : "#ffffff",
          },
        ]}
      >
        <Text style={styles.smallbuttonText}>自己</Text>
      </Pressable>
      <Pressable
        onPress={() => setsort2("all")}
        style={[
          styles.smallbutton,
          {
            backgroundColor: sort2 === "all" ? "#EEEEEE" : "#ffffff",
          },
        ]}
      >
        <Text style={styles.smallbuttonText}>所有</Text>
      </Pressable>
    </View>
  );
}
