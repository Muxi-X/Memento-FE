import React, { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useRouter } from 'expo-router';
import Mmexport from '../assets/images/mmexport.svg';
import Cixing from '../assets/images/cixing.svg';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function SplashScreenPage() {
  const router = useRouter();
  const fadeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.8); 
  const [svgLoaded, setSvgLoaded] = useState(false);

  
  const handleAnimationEnd = useCallback(async () => {
    await SplashScreen.hideAsync();
    router.replace('/(tabs)/today');
  }, [router]);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        const waitForSvg = async () => {
          await new Promise(resolve => setTimeout(resolve, 100));
          setSvgLoaded(true);
        };
        await waitForSvg();

        if (svgLoaded) {
          fadeAnim.value = withTiming(1, {
            duration: 1000,
            easing: Easing.ease 
          });
          scaleAnim.value = withTiming(1, {
            duration: 1000,
            easing: Easing.ease
          });
          const timer = setTimeout(() => {
            handleAnimationEnd();
          }, 1000);
          return () => clearTimeout(timer);
        }
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, [router, handleAnimationEnd, svgLoaded]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ scale: scaleAnim.value }]
    };
  });

  return (
    <SafeAreaProvider style={styles.container}>
      <AnimatedView style={[styles.logonContainer, containerAnimatedStyle]}>
        <Mmexport 
          style={styles.logo} 
        />
      </AnimatedView>
      <Cixing style={styles.cixing} />
      <Text style={styles.slogan}>看世界，从一个词开始</Text>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:"column",
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  logonContainer: {
    width: '100%', 
    height: 375,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 153,
    marginTop:178,
  
  },
  logo: {   
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  cixing: {
    position: 'absolute',
    width: 100,
    height: 100,
    left: 'auto',
    bottom: 83,
  },
  slogan: {
    fontSize: 12,
    color: '#333333',
    fontWeight: 400,
  },
});