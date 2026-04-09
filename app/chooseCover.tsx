import { View, StyleSheet, Pressable, Text, FlatList, Image, Dimensions } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Arrowback from "../assets/images/arrow-back.svg";
import { useEffect } from "react";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import { CustomImageItem } from "./api/interface";
import { setCustomKeywordCover } from "./api/custom";

const { width } = Dimensions.get("window");
const itemSize = (width - 30) / 3; 

export default function ChooseCover() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const images: CustomImageItem[] = params.images
    ? JSON.parse(params.images as string)
    : [];
const handeleChangecover = async(keyword_id:string,item_id:string,) => {
  await setCustomKeywordCover(keyword_id,item_id)
}
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const renderItem = ({ item }: { item: CustomImageItem }) => {
    return (
      <Pressable
        style={styles.imageItem}
        onPress={() => {
          console.log("选中封面：", item.id);
          handeleChangecover(params.keyword_id as string,item.id,)
          router.back();
        }}
      >
        <Image
          source={{ uri: item.image.variants.square_medium.url }}
          style={styles.image}
          resizeMode="cover"
        />
      </Pressable>
    );
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Arrowback />
        </Pressable>
        <Text style={styles.headertext}>选择封面</Text>
      </View>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    width: "100%",
    marginTop: 41,
    height: 47,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headertext: {
    fontSize: 16,
    position: "absolute",
    alignSelf: "center",
    left: 0,
    right: 0,
    textAlign: "center",
  },
  list: {
    padding: 10,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  imageItem: {
    width: itemSize,
    height: itemSize,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});