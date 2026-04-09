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
      <Pressable onPress={() => setsort("random")}>
        <Text
          style={[
            styles.smallbutton,
            {
              backgroundColor: sort === "random" ? "#EEEEEE" : "#ffffff",
              textAlign: "center",
            },
          ]}
        >
          随机
        </Text>
      </Pressable>
      <Pressable onPress={() => setsort("latest")}>
        <Text
          style={[
            styles.smallbutton,
            {
              backgroundColor: sort === "latest" ? "#EEEEEE" : "#ffffff",
              textAlign: "center",
            },
          ]}
        >
          最新
        </Text>
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
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    shadowOpacity: 0.2,
    elevation: 4,
  },
  smallbutton: {
    width: 36,
    height: 20,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
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
      <Pressable onPress={() => setsort2("me")}>
        <Text
          style={[
            styles.smallbutton,
            {
              backgroundColor: sort2 === "me" ? "#EEEEEE" : "#ffffff",
              textAlign: "center",
            },
          ]}
        >
          自己
        </Text>
      </Pressable>
      <Pressable onPress={() => setsort2("all")}>
        <Text
          style={[
            styles.smallbutton,
            {
              backgroundColor: sort2 === "all" ? "#EEEEEE" : "#ffffff",
              textAlign: "center",
            },
          ]}
        >
          所有
        </Text>
      </Pressable>
    </View>
  );
}
