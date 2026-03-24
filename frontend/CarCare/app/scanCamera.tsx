import { uploadScanForAnalysis, type ScanAnalyzeResponse } from '@/api';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Linking,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BG = '#0B1220';
const ACCENT = '#5FA8D3';
const TEXT = '#F2F4F8';
const SUB = '#8D8D8D';

export default function ScanCamera() {
  const router = useRouter();
  const camRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ScanAnalyzeResponse | null>(null);

  const promptForCamera = useCallback(async () => {
    try {
      const next = await requestPermission();
      if (!next.granted) {
        Alert.alert(
          'Camera not enabled',
          'Permission is still off. If you selected "Don\'t Allow", enable Camera for CarCare in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => void Linking.openSettings() },
          ],
        );
      }
    } catch (e) {
      Alert.alert(
        'Camera permission',
        e instanceof Error ? e.message : 'Something went wrong. Try Open Settings.',
      );
    }
  }, [requestPermission]);

  const onCapture = useCallback(async () => {
    try {
      const photo = await camRef.current?.takePictureAsync({ quality: 0.85 });
      if (photo?.uri) setPreviewUri(photo.uri);
    } catch {
      Alert.alert('Could not capture', 'Try again or check camera permissions.');
    }
  }, []);

  const onUpload = useCallback(async () => {
    if (!previewUri) return;
    setUploading(true);
    setResult(null);
    try {
      const data = await uploadScanForAnalysis(previewUri);
      setResult(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Upload failed';
      Alert.alert('Upload failed', msg);
    } finally {
      setUploading(false);
    }
  }, [previewUri]);

  const onClose = () => {
    router.back();
  };

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={ACCENT} size="large" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.permissionBox}>
          <Ionicons name="camera-outline" size={48} color={ACCENT} />
          <Text style={styles.title}>Camera access</Text>
          <Text style={styles.sub}>
            CarCare needs the camera to photograph your vehicle for scan analysis.
          </Text>
          <Pressable style={styles.primaryBtn} onPress={() => void promptForCamera()}>
            <Text style={styles.primaryBtnText}>Allow camera</Text>
          </Pressable>
          <Pressable
            style={styles.secondaryOutlineBtn}
            onPress={() => void Linking.openSettings()}
          >
            <Text style={styles.secondaryOutlineBtnText}>Open Settings</Text>
          </Pressable>
          <Text style={styles.hint}>
            If you tapped Don&apos;t Allow, use Settings to turn the camera on for CarCare.
          </Text>
          <Pressable style={styles.textBtn} onPress={onClose}>
            <Text style={styles.textBtnLabel}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      {previewUri ? (
        <Image source={{ uri: previewUri }} style={StyleSheet.absoluteFill} contentFit="cover" />
      ) : (
        <CameraView ref={camRef} style={StyleSheet.absoluteFill} facing="back" mode="picture" />
      )}

      <SafeAreaView style={styles.overlay} edges={['top']}>
        <View style={styles.topBar}>
          <Pressable
            onPress={onClose}
            hitSlop={12}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
          >
            <Ionicons name="chevron-back" size={28} color={TEXT} />
          </Pressable>
          <Text style={styles.headerTitle}>Scan</Text>
          <View style={styles.topBarSpacer} />
        </View>
      </SafeAreaView>

      {result && (
        <View style={styles.resultPanel}>
          <Text style={styles.resultTitle}>Analysis</Text>
          <Text style={styles.resultBody}>{result.summary}</Text>
          {result.suggestions && result.suggestions.length > 0 && (
            <View style={styles.suggestions}>
              {result.suggestions.map((s) => (
                <Text key={s} style={styles.suggestionLine}>
                  • {s}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}

      <SafeAreaView style={styles.bottomBar} edges={['bottom']}>
        {previewUri ? (
          <View style={styles.actionsRow}>
            <Pressable
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}
              onPress={() => {
                setPreviewUri(null);
                setResult(null);
              }}
              disabled={uploading}
            >
              <Text style={styles.secondaryBtnText}>Retake</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.primaryBtnWide, pressed && styles.btnPressed]}
              onPress={onUpload}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryBtnText}>Upload for analysis</Text>
              )}
            </Pressable>
          </View>
        ) : (
          <View style={styles.captureRow}>
            <Pressable
              style={({ pressed }) => [styles.shutterOuter, pressed && { opacity: 0.85 }]}
              onPress={onCapture}
            >
              <View style={styles.shutterInner} />
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  centered: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  permissionBox: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
  },
  title: {
    color: TEXT,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  sub: {
    color: SUB,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  topBarSpacer: {
    width: 44,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: TEXT,
    fontSize: 18,
    fontWeight: '600',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnPressed: {
    opacity: 0.8,
  },
  resultPanel: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: '18%',
    zIndex: 1,
    backgroundColor: 'rgba(11,18,32,0.92)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(95,168,211,0.35)',
  },
  resultTitle: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  resultBody: {
    color: TEXT,
    fontSize: 15,
    lineHeight: 22,
  },
  suggestions: {
    marginTop: 12,
    gap: 6,
  },
  suggestionLine: {
    color: SUB,
    fontSize: 14,
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  captureRow: {
    alignItems: 'center',
    paddingBottom: 12,
    paddingTop: 8,
  },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#fff',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
    alignItems: 'center',
  },
  secondaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  secondaryBtnText: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    color: SUB,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
    paddingHorizontal: 12,
  },
  primaryBtn: {
    backgroundColor: ACCENT,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 8,
  },
  primaryBtnWide: {
    flex: 1,
    backgroundColor: ACCENT,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  secondaryOutlineBtn: {
    marginTop: 4,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(95,168,211,0.55)',
  },
  secondaryOutlineBtnText: {
    color: ACCENT,
    fontSize: 16,
    fontWeight: '600',
  },
  textBtn: {
    marginTop: 8,
    padding: 8,
  },
  textBtnLabel: {
    color: SUB,
    fontSize: 16,
  },
  btnPressed: {
    opacity: 0.85,
  },
});
