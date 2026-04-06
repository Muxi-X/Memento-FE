import React, { use, useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
export const SettingButton = () => {
  const [change, setChange] = useState(false);
  return (
    <>
      {change ? (
        <Pressable
          style={[styles.changebtn,{backgroundColor:"#72B6FF",alignItems:"flex-end",paddingRight:1}]}
          onPress={() => setChange(!change)}
        >
          <View style={styles.circle}></View>
        </Pressable>
      ) : (
        <Pressable style={styles.changebtn} onPress={() => setChange(!change)}>
          <View style={styles.circle}></View>
        </Pressable>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  changebtn: {
    height: 20,
    width: 42,
    backgroundColor: "#EEEEEE",
    borderRadius: 99,
    justifyContent: "center",
    paddingLeft: 1,
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    backgroundColor: "#FFFFFF",
  },

});
