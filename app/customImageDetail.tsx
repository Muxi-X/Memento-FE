/**
 * 自定义图片详情组件
 * 用于展示同一时间组所有图片的详细信息，支持左右滑动查看
 */

import { BlurView } from 'expo-blur';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Arrow from '../assets/images/arrow-bottom.svg';
import Arrowback from '../assets/images/goback.svg';
import VoiceIcon from '../assets/images/sound2.svg';
import { getCustomImageDetail } from './api/custom';
import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';
import type { CustomImageDetail } from './api/interface';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

function formatIsoDateToYMD(isoDate: string) {
  if (!isoDate) return '';
  try {
    const date = new Date(isoDate);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  } catch {
    return '';
  }
}

export default function CustomImageDetailPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [details, setDetails] = useState<CustomImageDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showImageView, setShowImageView] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const params = useLocalSearchParams();
  const router = useRouter();

  const imageIds: string[] = useMemo(() => {
    const raw = params.image_ids;
    if (!raw) return [];
    try {
      const parsed = JSON.parse(Array.isArray(raw) ? raw[0] : raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [params.image_ids]);

  const initialImageId = (() => {
    if (Array.isArray(params.initial_image_id)) {
      return params.initial_image_id[0] || '';
    }
    return params.initial_image_id || '';
  })();

  const initialScrollIndex = useMemo(() => {
    if (!details.length || !initialImageId) return 0;
    const index = details.findIndex((d) => d.id === initialImageId);
    return index >= 0 ? index : 0;
  }, [details, initialImageId]);

  useEffect(() => {
    const fetchAll = async () => {
      if (!imageIds.length) {
        setError('无效的图片ID');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const results = await Promise.all(imageIds.map((id) => getCustomImageDetail(id)));
        setDetails(results.map((res) => res.data));
        setError('');
      } catch (err) {
        console.error('获取详情失败：', err);
        setError('加载失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [imageIds]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color="#72B6FF" />
      </View>
    );
  }

  if (error || !details.length) {
    return (
      <View style={styles.emptyContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.emptyText}>{error || '暂无作品数据'}</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>返回</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: '',
          headerTintColor: '#fff',
        }}
      />
      <Pressable
        style={{ position: 'absolute', top: 60, left: 16, zIndex: 999 }}
        onPress={() => router.back()}
      >
        <Arrowback style={{ width: 24, height: 24 }} />
      </Pressable>

      <FlatList
        data={details}
        keyExtractor={(item, index) => item.id || String(index)}
        horizontal
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialScrollIndex}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        decelerationRate="fast"
        pagingEnabled
        renderItem={({ item, index }) => {
          const noteText = item.note ?? '';

          return (
            <View style={{ width: screenWidth, height: screenHeight }}>
              <ImageBackground
                source={{ uri: item.image?.variants?.detail_large?.url || '' }}
                style={styles.backgroundImage}
                imageStyle={styles.imageStyle}
              >
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill}>
                  <View style={styles.contentContainer}>
                    <Pressable
                      style={styles.imagelist}
                      onPress={() => {
                        setCurrentImageIndex(index);
                        setShowImageView(true);
                      }}
                    >
                      <Image
                        source={{
                          uri: item.image?.variants?.detail_large?.url || '',
                        }}
                        style={{
                          height: undefined,
                          maxHeight: screenHeight,
                          width: '100%',
                          aspectRatio:
                            item.image.variants.detail_large.width /
                            item.image.variants.detail_large.height,
                        }}
                        resizeMode="cover"
                      />
                    </Pressable>
                    <View style={styles.wenanContainter}>
                      <View
                        style={{
                          flexDirection: 'row',
                          paddingBottom: 5,
                          height: 35,
                          width: screenWidth - 24,
                          alignItems: 'flex-end',
                          position: 'relative',
                        }}
                      >
                        <Text style={styles.title}>{item.title || ''}</Text>
                        {item.has_audio && (
                          <Pressable style={styles.voice}>
                            <VoiceIcon />
                            <Text style={{ color: '#FFFFFF', fontSize: 12 }}>
                              {`${item.audio_duration_ms || 0}'`}
                            </Text>
                          </Pressable>
                        )}

                        <Text style={styles.date}>{formatIsoDateToYMD(item.created_at)}</Text>
                      </View>
                      {/* 分界线 */}
                      <View
                        style={{
                          height: 0,
                          width: screenWidth - 24,
                          borderColor: 'rgba(253, 253, 253, 0.2)',
                          borderWidth: 1,
                          marginBottom: 24,
                        }}
                      ></View>

                      <View style={styles.copywritingWrapper}>
                        {isExpanded ? (
                          <ScrollView
                            style={styles.copywritingExpanded}
                            showsVerticalScrollIndicator={false}
                          >
                            <Text style={styles.copywritingText}>{noteText}</Text>

                            {noteText.length > 30 && (
                              <Pressable
                                style={styles.toggleButton}
                                onPress={() => setIsExpanded(!isExpanded)}
                              >
                                <Arrow />
                                <Text style={styles.toggleButtonText}>
                                  {isExpanded ? '收起' : '展开'}
                                </Text>
                              </Pressable>
                            )}
                          </ScrollView>
                        ) : (
                          <Text
                            style={[styles.copywritingText, styles.copywritingCollapsed]}
                            numberOfLines={3}
                          >
                            {noteText}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </BlurView>
              </ImageBackground>
            </View>
          );
        }}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
      />
      <Modal
        isVisible={showImageView}
        onBackdropPress={() => setShowImageView(false)}
        onSwipeComplete={() => setShowImageView(false)}
        onBackButtonPress={() => setShowImageView(false)}
        swipeDirection={['up']}
        style={{ margin: 0 }}
        statusBarTranslucent
      >
        <ImageViewer
          imageUrls={details.map((d) => ({
            url: d.image?.variants?.detail_large?.url || '',
          }))}
          index={currentImageIndex}
          onCancel={() => setShowImageView(false)}
          enableSwipeDown
          onSwipeDown={() => setShowImageView(false)}
          saveToLocalByLongPress={false}
          enablePreload
          backgroundColor="rgba(0,0,0,0.9)"
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: '#72B6FF',
    borderRadius: 8,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  backgroundImage: {
    alignItems: 'center',
    width: '100%',
    height: screenHeight,
  },
  imageStyle: {
    opacity: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  imagelist: {
    width: '100%',
    zIndex: 1,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wenanContainter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: screenHeight * 0.73,
    zIndex: 999,
    position: 'absolute',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 500,
  },
  voice: {
    height: 24,
    width: 72,
    flexDirection: 'row',
    borderRadius: 10,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    marginLeft: 12,
    alignItems: 'center',
    paddingHorizontal: 4,
    gap: 5,
  },
  date: {
    position: 'absolute',
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 400,
    right: 9,
    bottom: 5,
  },
  copywritingWrapper: {
    width: screenWidth - 24,
    position: 'relative',
  },
  copywritingCollapsed: {
    height: 60,
    lineHeight: 20,
    overflow: 'hidden',
  },
  copywritingExpanded: {
    maxHeight: 200,
    width: '100%',
  },
  copywritingText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 400,
  },
  toggleButton: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    right: 0,
    bottom: -20,
  },
  toggleButtonText: {
    fontSize: 12,
    color: '#72B6FF',
  },
});
