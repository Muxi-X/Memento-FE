import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Text,
  Modal,
} from "react-native";
import Svg, { Defs, Rect, Mask } from "react-native-svg";
import Trancle from "../assets/images/sanjiao.svg";
import Guide1 from "../assets/images/guide1.svg";
import Guide3 from "../assets/images/guide3.svg";

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

interface guideProps {
  visible: boolean;
  target: any;
  step: number;
  onNext: () => void;
}

export const GuideOverlay = ({ visible, target, step, onNext }: guideProps) => {
  // 没有目标或者不可见
  if (!visible || !target) return null;
  const { x, y, w, h } = target;
  // 根据步骤计算偏移量
  const getRectProps = () => {
    switch (step) {
      case 1:
        return {
          ax: x - 42,
          ay: y - 11,
          aw: w + 84,
          ah: h + 22,
          rx: 50,
        };
      case 2:
        return {
          ax: x - 15,
          ay: y - 5,
          aw: w + 30,
          ah: h + 10,
          rx: 15,
        };
      case 3:
        return { ax: x, ay: y, aw: w, ah: h, rx: 20 };
      case 4:
        return { ax: x, ay: y, aw: w, ah: h, rx: 1 };
      default:
        return { ax: x, ay: y, aw: w, ah: h, rx: 0 };
    }
  };

  const rectProps = getRectProps();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
    >
      <View style={[StyleSheet.absoluteFill, { opacity: 1 }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onNext}>
          <Svg
            style={{
              width: screenWidth,
              height: screenHeight,
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            <Defs>
              <Mask id="guide-mask">
                <Rect width="100%" height="100%" fill="white" />
                {/* 使用普通 Rect 替换 AnimatedRect */}
                <Rect
                  x={rectProps.ax}
                  y={rectProps.ay}
                  width={rectProps.aw}
                  height={rectProps.ah}
                  rx={rectProps.rx}
                  fill="black"
                />
              </Mask>
            </Defs>

            <Rect
              width="100%"
              height="100%"
              fill="rgba(0,0,0,0.65)"
              mask="url(#guide-mask)"
            />
          </Svg>

          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {step === 1 && (
              <View
                style={{
                  position: "absolute",
                  top: y - 106,
                  left: x - 210 + w,
                  width: 179,
                }}
              >
                <View style={styles.tipContainer}>
                  <Trancle style={styles.trancle} />
                  <Text style={styles.tipText}>
                    每一个词，都是一种
                    <Text style={{ fontWeight: "bold" }}>看世界的方式。</Text>
                    今天，我们从这个词开始。
                  </Text>
                </View>
                <Guide1 style={{ marginTop: -168, marginLeft: 108 }} />
              </View>
            )}

            {step === 2 && (
              <View
                style={[
                  styles.tipContainer,
                  {
                    position: "absolute",
                    top: y - 81,
                    left: x - 115,
                    width: 162,
                    height: 60,
                  },
                ]}
              >
                <Trancle style={styles.trancle} />
                <Text style={styles.tipText}>
                  看看别人，是如何理解同一个词的。
                </Text>
              </View>
            )}

            {step === 3 && (
              <View
                style={{ position: "absolute", top: y + 45, left: x - 156 }}
              >
                <View style={[styles.tipContainer, { width: 188, height: 60 }]}>
                  <Trancle
                    style={[
                      styles.trancle,
                      { bottom: 50, transform: [{ rotate: "60deg" }] },
                    ]}
                  />
                  <Text style={styles.tipText}>
                    当你不知道该拍什么，这里会给你一些可能的方向
                  </Text>
                </View>
                <Guide3 style={{ marginTop: -70, marginLeft: -122 }} />
              </View>
            )}

            {step === 4 && (
              <View
                style={{
                  position: "absolute",
                  top: y - 88,
                  left: x + w / 2 - 134,
                }}
              >
                <View style={[styles.tipContainer, { width: 268, height: 66 }]}>
                  <Trancle
                    style={[styles.trancle, { right: "50%", marginRight: -10 }]}
                  />
                  <Text style={styles.tipText}>
                    这里有不同的观察方向，每天
                    <Text style={{ fontWeight: "500" }}>只能选一个</Text>
                    {"\n"}你更想从哪个方向开始？
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  tipContainer: {
    borderRadius: 20,
    backgroundColor: "#CEE6FF",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tipText: {
    color: "#3D3D3D",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
  },
  trancle: {
    bottom: -11,
    position: "absolute",
    right: 10,
  },
});