import { Modal, View, useWindowDimensions } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import GuideBubble from "./GuideBubble";
import { GuideRect, GuideStep, GuideTargetKey } from "./types";

type GuideOverlayProps = {
  currentStep: number;
  layouts: Partial<Record<GuideTargetKey, GuideRect | null>>;
  onAdvance: () => void;
  onClose: () => void;
  steps: GuideStep[];
  visible: boolean;
};

const BUBBLE_HEIGHT = 196;
const BUBBLE_MARGIN = 24;
const BUBBLE_WIDTH = 304;
const EDGE_GAP = 16;
const FOCUS_PADDING = 12;
const MASK_COLOR = "rgba(16, 24, 40, 0.72)";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function GuideOverlay({
  currentStep,
  layouts,
  onAdvance,
  onClose,
  steps,
  visible,
}: GuideOverlayProps) {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  if (!visible || steps.length === 0) {
    return null;
  }

  const step = steps[Math.min(currentStep, steps.length - 1)];
  const targetRect = layouts[step.key] ?? (step.fallbackKey ? layouts[step.fallbackKey] : null);

  if (!targetRect) {
    return null;
  }

  const focusX = clamp(
    targetRect.x - FOCUS_PADDING,
    EDGE_GAP,
    Math.max(EDGE_GAP, windowWidth - EDGE_GAP),
  );
  const focusY = clamp(
    targetRect.y - FOCUS_PADDING,
    EDGE_GAP,
    Math.max(EDGE_GAP, windowHeight - EDGE_GAP),
  );
  const focusWidth = clamp(
    targetRect.width + FOCUS_PADDING * 2,
    0,
    Math.max(0, windowWidth - focusX - EDGE_GAP),
  );
  const focusHeight = clamp(
    targetRect.height + FOCUS_PADDING * 2,
    0,
    Math.max(0, windowHeight - focusY - EDGE_GAP),
  );
  const focusRight = focusX + focusWidth;
  const focusBottom = focusY + focusHeight;

  let placement = step.placement ?? "bottom";

  if (placement === "top" && focusY <= BUBBLE_HEIGHT + BUBBLE_MARGIN) {
    placement = "bottom";
  }

  if (
    placement === "bottom" &&
    focusBottom + BUBBLE_HEIGHT + BUBBLE_MARGIN >= windowHeight
  ) {
    placement = "top";
  }

  let bubbleLeft = focusX + focusWidth / 2 - BUBBLE_WIDTH / 2;

  if (step.align === "left") {
    bubbleLeft = focusX;
  }

  if (step.align === "right") {
    bubbleLeft = focusRight - BUBBLE_WIDTH;
  }

  bubbleLeft = clamp(
    bubbleLeft,
    EDGE_GAP,
    Math.max(EDGE_GAP, windowWidth - BUBBLE_WIDTH - EDGE_GAP),
  );

  const bubbleTop =
    placement === "bottom"
      ? clamp(
          focusBottom + BUBBLE_MARGIN,
          EDGE_GAP,
          Math.max(EDGE_GAP, windowHeight - BUBBLE_HEIGHT - EDGE_GAP),
        )
      : clamp(
          focusY - BUBBLE_HEIGHT - BUBBLE_MARGIN,
          EDGE_GAP,
          Math.max(EDGE_GAP, windowHeight - BUBBLE_HEIGHT - EDGE_GAP),
        );

  const tailLeft = clamp(
    focusX + focusWidth / 2 - bubbleLeft - 8,
    28,
    BUBBLE_WIDTH - 28,
  );

  return (
    <Modal
      animationType="none"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View className="flex-1">
        <Animated.View
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(120)}
          className="flex-1"
        >
          <View
            className="absolute left-0 top-0"
            style={{
              backgroundColor: MASK_COLOR,
              height: focusY,
              width: windowWidth,
            }}
          />
          <View
            className="absolute left-0"
            style={{
              backgroundColor: MASK_COLOR,
              height: focusHeight,
              top: focusY,
              width: focusX,
            }}
          />
          <View
            className="absolute"
            style={{
              backgroundColor: MASK_COLOR,
              height: focusHeight,
              left: focusRight,
              top: focusY,
              width: Math.max(0, windowWidth - focusRight),
            }}
          />
          <View
            className="absolute left-0"
            style={{
              backgroundColor: MASK_COLOR,
              height: Math.max(0, windowHeight - focusBottom),
              top: focusBottom,
              width: windowWidth,
            }}
          />

          <Animated.View
            entering={FadeIn.duration(220)}
            exiting={FadeOut.duration(140)}
            className="absolute rounded-[28px] border-2 border-[#72B6FF]"
            style={{
              height: focusHeight,
              left: focusX,
              top: focusY,
              width: focusWidth,
            }}
          />
          <View
            className="absolute rounded-[32px] border border-white/80"
            style={{
              height: focusHeight + 8,
              left: focusX - 4,
              top: focusY - 4,
              width: focusWidth + 8,
            }}
          />

          <GuideBubble
            bubbleLeft={bubbleLeft}
            bubbleTop={bubbleTop}
            currentStep={currentStep}
            description={step.description}
            isLastStep={currentStep === steps.length - 1}
            onPrimaryPress={onAdvance}
            onSkip={onClose}
            placement={placement}
            tailLeft={tailLeft}
            title={step.title}
            totalSteps={steps.length}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}
