import React from'react';
import { View,Text,StyleSheet,Image } from'react-native';
import { CustomImageItem } from '../app/api/interface';
interface CustomShowProps {
  item: CustomImageItem; 
}
export default function CustomShow(props: CustomShowProps) {

  const { item } = props;
  console.log(item);
  

  return (
    <View>

      <View style={styles.photoshow}>
        <Image source={{uri: item.image.variants.square_medium.url}} style={{width: 123, height: 123}}></Image>
      </View>
    </View>
  );
}
const styles=StyleSheet.create({
    title:{},
    photoshow:{
        marginLeft:3,
        marginTop:3
    }

})