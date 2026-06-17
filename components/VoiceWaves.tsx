import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface VoiceWavesProps {
  playing?: boolean;
  color?: string; // 静态/动态线条颜色
  barCount?: number;
  width?: number;
  height?: number;
}

export const VoiceWaves = ({
  playing = false,
  color = '#808080',
  barCount = 3,
  width = 10,
  height = 16,
}: VoiceWavesProps) => {
  // 为每条线创建动画值（0 = 最小缩放, 1 = 最大缩放）
  const animValuesRef = useRef<Animated.Value[]>(
    Array.from({ length: barCount }, () => new Animated.Value(0)),
  );
  const animationsRef = useRef<Animated.CompositeAnimation[] | null>(null);

  useEffect(() => {
    if (playing) {
      animationsRef.current = animValuesRef.current.map((value, index) => {
        const phase = index * 150;
        return Animated.loop(
          Animated.sequence([
            Animated.delay(phase),
            Animated.timing(value, {
              toValue: 1,
              duration: 350,
              useNativeDriver: true,
            }),
            Animated.timing(value, {
              toValue: 0,
              duration: 350,
              useNativeDriver: true,
            }),
          ]),
        );
      });
      animationsRef.current.forEach((anim) => anim.start());
    } else {
      // 停止动画并重置为静态
      if (animationsRef.current) {
        animationsRef.current.forEach((anim) => anim.stop());
      }
      animValuesRef.current.forEach((value) => value.setValue(0));
    }

    return () => {
      if (animationsRef.current) {
        animationsRef.current.forEach((anim) => anim.stop());
      }
    };
  }, [playing]);

  const staticHeights = Array.from({ length: barCount }, (_, i) => {
    if (barCount === 3) {
      return [0.45, 0.7, 1.0][i]; // 左低右高
    }
    return 0.3 + 0.7 * (i / (barCount - 1));
  });

  const barWidth = Math.max(2, Math.floor(width / (barCount * 1.6)));
  const gap = Math.max(1, Math.floor((width - barWidth * barCount) / (barCount + 1)));

  return (
    <View
      style={{
        width,
        height,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap,
      }}
    >
      {animValuesRef.current.map((value, index) => {
        const staticRatio = staticHeights[index];
        const minScale = staticRatio;
        const maxScale = Math.min(1.0, staticRatio * 1.6);
        const scaleY = value.interpolate({
          inputRange: [0, 1],
          outputRange: [minScale, maxScale],
        });

        return (
          <Animated.View
            key={index}
            style={{
              width: barWidth,
              height,
              backgroundColor: color,
              borderRadius: Math.ceil(barWidth / 2),
              transform: [{ scaleY }],
            }}
          />
        );
      })}
    </View>
  );
};

export default VoiceWaves;
