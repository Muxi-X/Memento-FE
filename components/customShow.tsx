import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { CustomImageItem } from '../app/api/interface';
import { useRouter } from "expo-router";

interface CustomShowProps {
  item: CustomImageItem;
  allImageIds: string[];
}

export default function CustomShow(props: CustomShowProps) {

  const { item, allImageIds } = props;
  const router = useRouter();

  console.log(item);

  return (
    <View>
      <Pressable
        style={styles.photoshow}
        onPress={() => {
          router.push({
            pathname: "/customImageDetail",
            params: {
              image_ids: JSON.stringify(allImageIds),
              initial_image_id: item.id,
            }
          });
        }}
      >
        <Image
          source={{ uri: item.image.variants.square_medium.url }}
          style={{ width: 123, height: 123 }}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {},
  photoshow: {
    marginLeft: 3,
    marginTop: 3
  }
});