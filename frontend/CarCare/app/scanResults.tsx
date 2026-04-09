import { Image } from 'expo-image';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles, GradientText } from '../styles/global';
import Divider from '@/styles/divider';
import type { ScanResultPayload } from '@/types/scanResult';

const PLACEHOLDER = require('../assets/images/checkEngine.jpg');

function emptyScanResult(): ScanResultPayload {
  return {
    ocr: { headline: '', observations: [] },
    llm: { summary: '', suggestions: [], cautionNotes: [] },
    youtube: [],
  };
}

function paramToString(value: string | string[] | undefined): string | undefined {
  if (typeof value === 'string' && value.length > 0) return value;
  if (Array.isArray(value) && value[0]) return value[0];
  return undefined;
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={[globalStyles.horizontalContainer, styles.sectionHeader]}>
      <GradientText style={globalStyles.gradientH2}>{title}</GradientText>
    </View>
  );
}

function EmptyLine() {
  return (
    <Text style={[globalStyles.grayP, styles.emptyLine]}>
      No analysis available yet.
    </Text>
  );
}

export default function ScanResults() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    imageUri?: string | string[];
  }>();
  const scanImageUri = useMemo(() => {
    const raw = paramToString(params.imageUri);
    if (!raw) return undefined;
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }, [params.imageUri]);

  const [manualDescription, setManualDescription] = useState('');
  const [descriptionSubmitted, setDescriptionSubmitted] = useState(false);
  const [heroImageFailed, setHeroImageFailed] = useState(false);

  const goRetakePhoto = useCallback(() => {
    router.push({ pathname: '/scanCamera' });
  }, [router]);

  const onSubmitDescription = useCallback(() => {
    const trimmed = manualDescription.trim();
    if (!trimmed) {
      Alert.alert('Add a description', 'Type what you see or what seems wrong before submitting.');
      return;
    }
    setDescriptionSubmitted(true);
    Alert.alert('Thanks', 'Your description was saved for this session.');
  }, [manualDescription]);

  useEffect(() => {
    setHeroImageFailed(false);
  }, [scanImageUri]);

  /** `payload.ocr` is for backend / internal use only — not shown in the UI. */
  const payload = useMemo(() => emptyScanResult(), []);

  const llm = payload.llm;
  const youtube = payload.youtube;

  const hasLlmContent = Boolean(
    (llm?.summary && llm.summary.length > 0) ||
      (llm?.suggestions && llm.suggestions.length > 0) ||
      (llm?.cautionNotes && llm.cautionNotes.length > 0),
  );

  return (
    <SafeAreaView style={styles.safeRoot} edges={['bottom']}>
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[styles.scrollContent, styles.scrollContentOverride]}
      showsVerticalScrollIndicator
      keyboardShouldPersistTaps="handled"
      bounces
    >
      {/* Do not use globalStyles.container here: flex:1 + justifyContent:center breaks ScrollView and can hide content below the fold. */}
      <View style={styles.screenContent}>
        <View style={[globalStyles.horizontalContainer]}>
          <TouchableOpacity onPress={() => router.back()}>
            <GradientText style={[globalStyles.whiteBackButton, { paddingLeft: 15, paddingHorizontal: 0 }]}>
              {'< Back'}
            </GradientText>
          </TouchableOpacity>
        </View>

        <View style={[globalStyles.horizontalContainer]}>
          <GradientText style={[globalStyles.gradientHeader, { paddingHorizontal: 15, padding: 0 }]}>
            Scan Results
          </GradientText>
        </View>

        <Image
          source={scanImageUri && !heroImageFailed ? { uri: scanImageUri } : PLACEHOLDER}
          style={styles.heroImage}
          contentFit="cover"
          onError={() => setHeroImageFailed(true)}
        />

        <View style={{ width: '90%' }}>
          <Divider />
        </View>

        <SectionHeader title="Suggestions" />
        <View style={[globalStyles.horizontalContainer, styles.bodyCol]}>
          {llm?.summary ? (
            <Text style={globalStyles.grayP}>{llm.summary}</Text>
          ) : null}
          {llm?.suggestions && llm.suggestions.length > 0 ? (
            llm.suggestions.map((line, i) => (
              <Text key={i} style={globalStyles.grayP}>
                {'\u25E6 '}
                {line}
              </Text>
            ))
          ) : !hasLlmContent ? (
            <EmptyLine />
          ) : null}
          {llm?.cautionNotes && llm.cautionNotes.length > 0 ? (
            <>
              <Text style={[globalStyles.grayP, styles.cautionLabel]}>Notes</Text>
              {llm.cautionNotes.map((line, i) => (
                <Text key={i} style={[globalStyles.grayP, styles.cautionLine]}>
                  {line}
                </Text>
              ))}
            </>
          ) : null}
        </View>

        <View style={{ width: '90%' }}>
          <Divider />
        </View>

        <SectionHeader title="Tutorials" />
        <View style={[globalStyles.horizontalContainer, styles.bodyCol]}>
          {youtube.length > 0 ? (
            youtube.map((vid, i) => (
              <TouchableOpacity
                key={`${vid.url}-${i}`}
                style={styles.videoRow}
                onPress={() => void Linking.openURL(vid.url)}
              >
                <Text style={styles.videoTitle}>{vid.title}</Text>
                {vid.channelTitle ? (
                  <Text style={styles.videoMeta}>{vid.channelTitle}</Text>
                ) : null}
                <Text style={styles.videoLink}>{vid.url}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <EmptyLine />
          )}
        </View>

        <View style={{ width: '90%' }}>
          <Divider />
        </View>

        <SectionHeader title="Not quite right?" />
        <View style={[globalStyles.horizontalContainer, styles.bodyCol]}>
          <Text style={globalStyles.grayP}>
            If the photo wasn&apos;t recognized correctly—or the wrong part was detected—you can take a clearer
            picture or describe the problem in your own words below.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.retakeBtn, pressed && styles.retakeBtnPressed]}
            onPress={goRetakePhoto}
          >
            <Text style={styles.retakeBtnText}>Retake photo</Text>
          </Pressable>
          <Text style={[globalStyles.grayP, styles.manualLabel]}>Describe what you see (optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. The orange engine-shaped light is flashing on the dash…"
            placeholderTextColor="#666"
            multiline
            value={manualDescription}
            onChangeText={(t) => {
              setManualDescription(t);
              setDescriptionSubmitted(false);
            }}
            textAlignVertical="top"
          />
          <Pressable
            style={({ pressed }) => [
              styles.submitDescBtn,
              (!manualDescription.trim() || descriptionSubmitted) && styles.submitDescBtnDisabled,
              pressed && manualDescription.trim() && !descriptionSubmitted && styles.submitDescBtnPressed,
            ]}
            onPress={onSubmitDescription}
            disabled={!manualDescription.trim() || descriptionSubmitted}
          >
            <Text style={styles.submitDescBtnText}>
              {descriptionSubmitted ? 'Description saved' : 'Submit description'}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeRoot: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  screenContent: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    gap: 15,
    flex: 1,
    paddingBottom: 48,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 160,
    flexGrow: 0,
  },
  scrollContentOverride: {
    paddingHorizontal: 0,
  },
  heroImage: {
    width: '95%',
    height: 200,
    borderRadius: 25,
    backgroundColor: '#111',
  },
  sectionHeader: {
    paddingHorizontal: 15,
    marginTop: 8,
    justifyContent: 'flex-start',
  },
  bodyCol: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: 15,
    gap: 8,
  },
  emptyLine: {
    fontStyle: 'italic',
    opacity: 0.85,
  },
  cautionLabel: {
    marginTop: 8,
    fontWeight: '600',
  },
  cautionLine: {
    opacity: 0.95,
  },
  videoRow: {
    width: '100%',
    marginBottom: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333',
  },
  videoTitle: {
    fontFamily: 'Onest',
    fontSize: 17,
    color: '#e8e8e8',
    marginBottom: 4,
  },
  videoMeta: {
    fontFamily: 'Onest',
    fontSize: 14,
    color: '#8d8d8d',
    marginBottom: 4,
  },
  videoLink: {
    fontFamily: 'Onest',
    fontSize: 13,
    color: '#5FA8D3',
  },
  retakeBtn: {
    marginTop: 8,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(95,168,211,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(95,168,211,0.55)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  retakeBtnPressed: {
    opacity: 0.88,
  },
  retakeBtnText: {
    fontFamily: 'Onest',
    fontSize: 16,
    fontWeight: '600',
    color: '#5FA8D3',
  },
  manualLabel: {
    marginTop: 16,
    fontWeight: '600',
  },
  textInput: {
    alignSelf: 'stretch',
    minHeight: 100,
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    color: '#F2F4F8',
    fontFamily: 'Onest',
    fontSize: 16,
    lineHeight: 22,
  },
  submitDescBtn: {
    alignSelf: 'stretch',
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: '#5FA8D3',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitDescBtnDisabled: {
    opacity: 0.45,
  },
  submitDescBtnPressed: {
    opacity: 0.9,
  },
  submitDescBtnText: {
    fontFamily: 'Onest',
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
