import { PromptWords, SelectionState } from '@/app/api/interface';
import { trackPromptEntryClick, trackPromptKindClick } from '@/app/api/analytics';
import useDailyPromptStore from '@/app/stores/useDailyPromptStore';
import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import IdeaIcon from '../assets/images/idea.svg';
import Smalltip from './tipsmall';
import { GuideOverlay } from './guideOverlay';
import Createway from './createway';

interface IdeaProps {
  isGuideMode?: boolean;
  step?: number;
  onNext?: () => void;
  innerRef?: any;
  targetLayout?: any;
  setTargetLayout?: (layout: any) => void;
}

// 类型卡片配置：颜色与文案保持现有 UI 不变
const KIND_CONFIG: Record<
  PromptWords,
  {
    borderColor: string;
    textColor: string;
    tagColor: string;
    tagText: string;
    describeText: string;
  }
> = {
  [PromptWords.intuition]: {
    borderColor: '#B7E0FE',
    textColor: '#41A1FC',
    tagColor: '#41A1FC',
    tagText: '直觉',
    describeText: '基于第一感受与当下情绪',
  },
  [PromptWords.structure]: {
    borderColor: '#FFCCD2',
    textColor: '#FFA9BF',
    tagColor: '#FC9AA4',
    tagText: '空间',
    describeText: '关注个体在空间中的位置与方向',
  },
  [PromptWords.concept]: {
    borderColor: '#CFE9DC',
    textColor: '#6DBD95',
    tagColor: '#6DBD95',
    tagText: '观念',
    describeText: '围绕意义、主题与表达',
  },
};

const KIND_ORDER: PromptWords[] = [
  PromptWords.intuition,
  PromptWords.structure,
  PromptWords.concept,
];

export const Idea = ({
  isGuideMode = false,
  step = 0,
  onNext,
  innerRef,
  targetLayout,
  setTargetLayout,
}: IdeaProps) => {
  const [tipstate, setTipstate] = React.useState(false);
  const wasGuidingRef = useRef(false);

  const uiState = useDailyPromptStore((s) => s.uiState);
  const selection = useDailyPromptStore((s) => s.selection);
  const biz_date = useDailyPromptStore((s) => s.biz_date);
  const keyword_id = useDailyPromptStore((s) => s.keyword_id);
  const errorMessage = useDailyPromptStore((s) => s.errorMessage);
  const isCacheValid = useDailyPromptStore((s) => s.isCacheValid);
  const fetchDailyPrompt = useDailyPromptStore((s) => s.fetchDailyPrompt);
  const claimPrompt = useDailyPromptStore((s) => s.claimPrompt);

  // 根据当前 uiState 推导埋点用的 selection_state
  const getSelectionState = (): SelectionState => {
    if (uiState === 'selected') return 'selected';
    if (uiState === 'unselected') return 'unselected';
    return 'unknown';
  };

  const measureContent = () => {
    if (innerRef?.current && setTargetLayout) {
      setTimeout(() => {
        innerRef.current?.measureInWindow((x: number, y: number, w: number, h: number) => {
          let finalY = y;
          if (Platform.OS === 'android') {
            const statusBarHeight = StatusBar.currentHeight || 0;
            finalY = y + statusBarHeight;
          }
          setTargetLayout({ x, y: finalY, w, h });
        });
      }, 100);
    }
  };

  useEffect(() => {
    // 进入引导模式 → 自动打开
    if (isGuideMode) {
      wasGuidingRef.current = true;
      setTipstate(true);
    }
    // 只有当"之前处于引导中"且引导完成(step 回到 0)时 → 自动关闭
    else if (wasGuidingRef.current && step === 0) {
      wasGuidingRef.current = false;
      setTipstate(false);
    }
  }, [isGuideMode, step]);

  const handleOpen = () => {
    // 引导模式：自动打开不计为总入口点击
    if (isGuideMode) {
      setTipstate(true);
      return;
    }

    // 真实用户点击：记录总入口事件（含当天回看）
    trackPromptEntryClick(getSelectionState(), {
      biz_date: biz_date ?? null,
      keyword_id: keyword_id ?? null,
    });
    setTipstate(true);

    // 优先复用有效内存状态；无有效状态时才等待查询
    if (isCacheValid()) {
      // 后台静默刷新，不阻塞展示
      void fetchDailyPrompt({ silent: true });
    } else {
      void fetchDailyPrompt();
    }
  };

  const handleClose = () => {
    if (isGuideMode) return;
    setTipstate(false);
  };

  // 类型卡片点击：仅在 unselected 且非引导时上报并领取
  const handleKindPress = (kind: PromptWords) => {
    if (isGuideMode) return; // 引导不调用真实领取、不计点击
    if (uiState !== 'unselected') return;

    // 事件在发起领取请求前生成
    trackPromptKindClick(kind, {
      biz_date: biz_date ?? null,
      keyword_id: keyword_id ?? null,
    });
    void claimPrompt(kind);
  };

  // 已选详情：以后端返回的 kind 取色，不使用被点击卡片的颜色
  const selectedConfig = selection ? KIND_CONFIG[selection.kind] : null;

  const renderModalContent = () => {
    if (uiState === 'loading') {
      return (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#72B6FF" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      );
    }

    if (uiState === 'error') {
      return (
        <View style={styles.loadingWrap}>
          <Text style={styles.errorText}>{errorMessage || '加载失败'}</Text>
          <Pressable style={styles.retryBtn} onPress={() => void fetchDailyPrompt()}>
            <Text style={styles.retryText}>重试</Text>
          </Pressable>
        </View>
      );
    }

    if (uiState === 'selected' && selection && selectedConfig) {
      return (
        <>
          <View style={[styles.selectedCard, { borderColor: selectedConfig.borderColor }]}>
            <Text style={[styles.selectedContent, { color: selectedConfig.textColor }]}>
              {selection.content}
            </Text>
            <Text style={[styles.selectedTag, { color: selectedConfig.tagColor }]}>
              {selectedConfig.tagText}
            </Text>
          </View>
          <Text style={styles.modalTitle}>有灵感了？马上试试?</Text>
          <Createway />
        </>
      );
    }

    // unselected / selecting：展示三个类型入口
    const cardsDisabled = uiState === 'selecting';
    return KIND_ORDER.map((kind) => {
      const cfg = KIND_CONFIG[kind];
      return (
        <Smalltip
          key={kind}
          borderColor={cfg.borderColor}
          textColor={cfg.textColor}
          tagText={cfg.tagText}
          tagColor={cfg.tagColor}
          describeText={cfg.describeText}
          kind={kind}
          disabled={cardsDisabled}
          onPress={handleKindPress}
        />
      );
    });
  };

  return (
    <>
      <Pressable style={styles.findIcon} onPress={handleOpen}>
        <IdeaIcon width={24} height={26} />
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={tipstate}
        onRequestClose={handleClose}
        onShow={() => {
          if (isGuideMode) {
            measureContent();
          }
        }}
      >
        <Pressable style={styles.modalMask} onPress={handleClose}>
          <Pressable
            ref={innerRef}
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            {renderModalContent()}
          </Pressable>
        </Pressable>

        {isGuideMode && (
          <GuideOverlay visible={true} target={targetLayout} step={step} onNext={onNext!} />
        )}
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  findIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 26,
    height: 26,
  },
  modalMask: {
    flex: 1,
    backgroundColor: 'rgba(21, 24, 30, 0.2)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    minHeight: 429,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
  },
  errorText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#72B6FF',
    borderRadius: 20,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
  },
  selectedCard: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    borderRadius: 20,
    borderWidth: 2,
    padding: 22,
    marginBottom: 20,
    position: 'relative',
    minHeight: 100,
    justifyContent: 'center',
  },
  selectedContent: {
    fontSize: 22,
    fontWeight: '400',
    padding: 10,
  },
  selectedTag: {
    fontSize: 16,
    position: 'absolute',
    right: 15,
    bottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
  },
});
