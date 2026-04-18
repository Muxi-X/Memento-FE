import { useLocalSearchParams, Stack } from "expo-router";//从 URL 里拿参数
import { useEffect, useState } from "react";
import { Text, View,Dimensions,Image ,Pressable} from "react-native";
import { getCustomImageDetail } from "./api/custom";

//详情页组件
export default function CustomImageDetail() {
  const [expanded, setExpanded] = useState(false);
  const { image_id } = useLocalSearchParams();//从 URL 里拿 image_id
  const [detail, setDetail] = useState<any>(null);//准备一个变量存详情数据
  useEffect(() => {
    fetchDetail();
  }, []);
//接口函数
  const fetchDetail = async () => {
    try {
      const id = Array.isArray(image_id)
        ? image_id[0]
        : image_id;//保证 id 一定是 string
      const res = await getCustomImageDetail(
        id
      ); //请求后端接口

      console.log("详情数据：", res.data);
      setDetail(res.data);//把接口数据存进 detail
    } catch (error) {
      console.log("获取详情失败：", error);
    }
  };

  return (
    <View style={{ flex: 1}}>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerTintColor: "#fff",
          headerStyle: {
  
},
        }}
      />
      {/* Layer 1 背景模糊 */}
      <Image
  source={{ uri: 
      detail?.image
        ?.variants
        ?.detail_large
        ?.url }}
  style={{
    position: "absolute",
      width: "100%",
      height: "100%",
  }}
   blurRadius={20}
    resizeMode="cover"
/>
{/* Layer 2 清晰主图片 */}

<Image
  source={{
    uri:
      detail?.image
        ?.variants
        ?.detail_large
        ?.url
  }}
  style={{
    position: "absolute",
    top: 84,
    width: "100%",
    height: 500,
  }}
  resizeMode="cover"
/>

{/* 标题 */}
  <Text style={{
          position: "absolute",
          left: 21,
          top: 596,
          fontSize: 24,
          fontWeight: "500",
          color: "#fff",
        }}>
  {detail?.title}
</Text>
{/*日期 */}
<Text  style={{
    position: "absolute",
    right: 21,
    top: 608,
    fontSize: 14,
    color: "#fff",
  }}>
  {detail?.created_at?.slice(0, 10)}
</Text>
{/* 横线 */}

<View
  style={{
    position: "absolute",
    left: 24,
    top: 636,
    width: 327,
    height: 1,
    backgroundColor: "rgba(253,253,253,0.2)",
  }}
/>
<View
  style={{
    position: "absolute",
    left: 34,
    top: 648,
    width: 308,
  }}
>
{/* 文案 */}

<Text
  style={{
    fontSize: 18,
    lineHeight: 20,
    color: "#fff",
  }}numberOfLines={expanded ? undefined : 3}
>
  {detail?.note}
</Text>
{/* 展开按钮 */}

<Pressable
onPress={() => setExpanded(!expanded)}
  style={{
     alignSelf: "flex-end", 
      marginTop: 4,
      flexDirection: "row",
      alignItems: "center",
  }}
>
  {/* 箭头 */}

  <Text
    style={{
      color: "#72B6FF",
      fontSize: 16,
      marginRight: 4,
      transform: [
        { rotate: expanded ? "180deg" : "0deg" },
      ],
    }}
  >
    ⌄
  </Text>

  {/* 文字（展开） */}

  <Text
    style={{
      color: "#72B6FF",
      fontSize: 14,
    }}
  >
    {expanded ? "收起" : "展开"}
  </Text>

</Pressable>
  </View>
    </View>
  );
}