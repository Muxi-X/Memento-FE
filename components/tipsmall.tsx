import { PromptWords } from '@/app/api/interface';
import { Pressable, StyleSheet, Text, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface SmalltipProps {
  borderColor: string;
  textColor: string;
  tagText: string;
  tagColor: string;
  describeText: string;
  kind: PromptWords;
  disabled?: boolean;
  onPress?: (kind: PromptWords) => void;
}

/**
 * 受控类型入口卡片。
 * 不再各自维护详情弹窗和抽取，点击通过父级回调统一处理。
 */
export default function Smalltip({
  borderColor,
  textColor,
  tagText,
  tagColor,
  describeText,
  kind,
  disabled = false,
  onPress,
}: SmalltipProps) {
  return (
    <Pressable
      style={[
        styles.findkuang,
        {
          borderColor: borderColor,
          padding: 22,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      disabled={disabled}
      onPress={() => onPress?.(kind)}
    >
      <Text style={[styles.findtext]}>{tagText}</Text>
      <Text style={[styles.findsmalltext, { color: textColor }]}>{describeText}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  findkuang: {
    display: 'flex',
    flexDirection: 'column',
    width: screenWidth * (335 / 375),
    height: 100,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  findtext: {
    color: '#333333',
    fontSize: 22,
    fontWeight: '400',
  },
  findsmalltext: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 4,
  },
});
