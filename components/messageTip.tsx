import { notfiItem } from '@/app/api/interface';
import { View, StyleSheet, ImageBackground, Text, Image } from 'react-native';
import Inspire from '../assets/images/inspiration.svg';
import Empathy from '../assets/images/resonance.svg';
export default function MessageTip(props: notfiItem) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };
  return (
    <View style={styles.tips}>
      <View style={styles.touxiang}>
        <ImageBackground
          source={{ uri: props.actor_avatar_url }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            overflow: 'hidden',
          }}
        />
        {props.reaction_type === 'inspired' ? (
          <Inspire style={styles.Icon} />
        ) : (
          <Empathy style={styles.Icon} />
        )}
      </View>
      <View>
        <Text style={{ color: '#999', fontSize: 12 }}>{formatDate(props.created_at)}</Text>
        {props.reaction_type === 'inspired' ? (
          <Text style={styles.Inpiretext}>受到了启发</Text>
        ) : (
          <Text style={styles.Inpiretext}>和你有共鸣</Text>
        )}
      </View>
      <View style={styles.zuopin}>
        {props.cover_image && (
          <Image
            source={{ uri: props.cover_image.square_small.url }}
            style={{ width: '100%', height: '100%' }}
          ></Image>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  tips: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 80,
    width: '100%',
    borderBottomColor: '#EEEEEE',
    flex: 1,
    borderBottomWidth: 1,
    borderWidth: 0,
    position: 'relative',
  },
  touxiang: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    marginRight: 14,
    position: 'relative',
  },
  Icon: {
    position: 'absolute',
    top: 26,
    left: 26,
    zIndex: 1,
  },
  Inpiretext: {
    color: '#666666',
    fontSize: 14,
    lineHeight: 20,
  },
  zuopin: {
    width: 40,
    height: 40,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'absolute',
    top: 20,
    right: 24,
  },
});
