import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Alert,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import Voice from "../assets/images/voice.svg";
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from "expo-audio";

const { height: screenHeight } = Dimensions.get("window");
const CANCEL_AREA_TOP = screenHeight * 0.7;

interface VoiceRecorderProps {
  onRecordingSaved: (uri: string, duration: number) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingSaved }) => {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  // 权限标记
  const hasPermission = useRef(false);
  // 录音状态
  const [isRecording, setIsRecording] = useState(false);
  // 显示取消弹窗
  const [showCancelModal, setShowCancelModal] = useState(false);
  // 是否取消录音
  const [shouldCancel, setShouldCancel] = useState(false);
  // 实时录音时长（秒）
  const [recordingTime, setRecordingTime] = useState(0);
  // 记录手指初始位置
  const startY = useRef(0);
  // 定时器引用
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 检查并请求权限
  const checkAndRequestPermission = async () => {
    if (hasPermission.current) return true;
    const status = await AudioModule.requestRecordingPermissionsAsync();
    if (!status.granted) {
      Alert.alert("权限不足", "请先开启麦克风权限才能录制语音");
      return false;
    }
    hasPermission.current = true;
    await setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: true,
    });
    return true;
  };

  // 开始录音（新增定时器实时更新时长）
  const handleStartRecording = useCallback(
    async (event: any) => {
      const permissionGranted = await checkAndRequestPermission();
      if (!permissionGranted) return;

      startY.current = event.nativeEvent.pageY;
      setShouldCancel(false);
      setShowCancelModal(true);
      setIsRecording(true);
      setRecordingTime(0); // 重置时长

      try {
        await audioRecorder.prepareToRecordAsync();
        audioRecorder.record();

        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } catch (err) {
        console.error("开始录音失败:", err);
        setIsRecording(false);
        setShowCancelModal(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    },
    [audioRecorder],
  );

  // 停止录音（清理定时器）
  const handleStopRecording = useCallback(async () => {
    setIsRecording(false);
    setShowCancelModal(false);

    // 清理定时器
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (shouldCancel) {
      await audioRecorder.stop();
      setRecordingTime(0); 
      Alert.alert("已取消录音");
    } else {
      try {
        await audioRecorder.stop();
        const recordingUri = audioRecorder.uri;
        const finalDuration = recordingTime || Math.round(recorderState.durationMillis / 1000);

        if (recordingUri && onRecordingSaved) {
          onRecordingSaved(recordingUri, finalDuration);
        }
        console.log("录音已保存:", recordingUri, "时长:", finalDuration);
        setRecordingTime(0); 
      } catch (err) {
        console.error("保存录音失败:", err);
        Alert.alert("保存失败", "无法保存录音，请重试");
        setRecordingTime(0);
      }
    }
  }, [audioRecorder, shouldCancel, recordingTime, recorderState.durationMillis, onRecordingSaved]);

  // 监听手指移动
  const handleMove = useCallback(
    (event: any) => {
      const currentY = event.nativeEvent.pageY;
      if (currentY < CANCEL_AREA_TOP && !shouldCancel) {
        setShouldCancel(true);
      } else if (currentY >= CANCEL_AREA_TOP && shouldCancel) {
        setShouldCancel(false);
      }
    },
    [shouldCancel],
  );

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* 取消弹窗 Modal */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="slide"
        onRequestClose={() => {}}
      >
        <Pressable
          style={styles.cancelButton}
          onPress={() => {
            setShouldCancel(true);
            handleStopRecording();
          }}
        >
          <Text style={styles.cancelButtonText}>取消</Text>
        </Pressable>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {shouldCancel ? "松开取消" : "松手保存"}
            </Text>
          </View>
        </View>
      </Modal>

      {/* 录音按钮 */}
      <Pressable
        style={[styles.voiceButton, isRecording && styles.recordingButton]}
        onPressIn={handleStartRecording}
        onPressOut={handleStopRecording}
        onResponderMove={handleMove}
        disabled={isRecording} 
      >
        <Voice />
        <Text style={isRecording ? styles.recordingText : styles.buttonText}>
          {isRecording ? `录制中... ${recordingTime}秒` : "按住这里留下你的声音"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 16,
  },
  voiceButton: {
    flexDirection: "row",
    gap: 6,
    width: 191,
    height: 38,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  recordingButton: {
    backgroundColor: "#FFF5F5",
  },
  buttonText: {
    fontSize: 14,
    color: "#999999",
  },
  recordingText: {
    fontSize: 14,
    
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    position: "relative",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 999,
    padding: 20,
    alignItems: "center",
    height: 200,
    width: "100%",
    position: "absolute",
    bottom: -100,
  },
  modalTitle: {
    fontSize: 18,
    color: "#666666",
    marginBottom: 20,
  },
  recordingTimer: {
    fontSize: 24,
    color: "#333",
    fontWeight: "bold",
  },
  cancelButton: {
    position: "absolute",
    left: 123,
    bottom: 124,
    width: 126,
    height: 48,
    backgroundColor: " rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    borderRadius: 999,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default VoiceRecorder;