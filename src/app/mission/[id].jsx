import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiError } from '../../api/client';
import { skillBridgeApi } from '../../api/skillbridge';
import { useAuth } from '../../auth/AuthContext';
import ApiStateBanner from '../../components/ApiStateBanner';
import ScreenHeader from '../../components/ScreenHeader';
import { useApiResource } from '../../hooks/useApiResource';

export default function MissionDetailScreen() {
  const { id } = useLocalSearchParams();
  const missionId = Array.isArray(id) ? id[0] : id;
  const { isAuthenticated } = useAuth();

  const loadMission = useCallback(
    /** @param {AbortSignal} signal */
    (signal) => {
      if (!missionId) {
        return Promise.reject(new Error('Missing mission ID.'));
      }
      return skillBridgeApi.getMission(missionId, signal);
    },
    [missionId],
  );

  const {
    data: mission,
    error: missionError,
    loading: missionLoading,
    refresh: refreshMission,
  } = useApiResource(loadMission);

  const {
    data: submissions,
    error: submissionsError,
    refresh: refreshSubmissions,
  } = useApiResource(skillBridgeApi.getSubmissions, { enabled: isAuthenticated });

  const missionSubmissions = useMemo(
    () => (submissions ?? []).filter((item) => item.missionId === missionId),
    [missionId, submissions],
  );

  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(/** @type {string | null} */ (null));

  const handleSubmit = async () => {
    const trimmed = content.trim();
    if (!missionId || !trimmed) {
      setSubmitError('Write your response before submitting.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await skillBridgeApi.createSubmission(missionId, { content: trimmed });
      setContent('');
      refreshSubmissions();
      router.push(`/submission/${created.id}`);
    } catch (error) {
      if (error instanceof ApiError && error.requestId) {
        setSubmitError(`${error.message} (Request ID: ${error.requestId})`);
      } else {
        setSubmitError(error instanceof Error ? error.message : 'Failed to submit.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ScreenHeader
            subtitle={mission ? `Status: ${mission.status}` : 'Mission details'}
            title={mission?.title ?? 'Mission'}
          />

          <View style={styles.sectionGap}>
            <ApiStateBanner error={missionError} onRetry={refreshMission} />
          </View>

          {missionLoading && !mission ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color="#16B276" />
              <Text style={styles.loadingText}>Loading mission…</Text>
            </View>
          ) : null}

          {mission ? (
            <>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Overview</Text>
                <Text style={styles.summary}>{mission.summary}</Text>
                <Text style={styles.cardTitle}>Instructions</Text>
                <Text style={styles.instructions}>{mission.instructions}</Text>
              </View>

              {mission.rubric ? (
                <View style={styles.card}>
                  <View style={styles.rubricHeader}>
                    <Text style={styles.cardTitle}>Rubric</Text>
                    <Text style={styles.rubricVersion}>v{mission.rubric.version}</Text>
                  </View>
                  {mission.rubric.criteria.map((criterion, index) => (
                    <View
                      key={criterion.key}
                      style={[styles.criterionRow, index > 0 && styles.divider]}
                    >
                      <View style={styles.criterionTop}>
                        <Text style={styles.criterionTitle}>{criterion.title}</Text>
                        <Text style={styles.criterionMeta}>
                          Max {criterion.maxScore} · Weight {criterion.weight}
                        </Text>
                      </View>
                      <Text style={styles.criterionDesc}>{criterion.description}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Your Submission</Text>
                {!isAuthenticated ? (
                  <ApiStateBanner
                    isAuthenticated={false}
                    signInMessage="Sign in to submit your response and track assessment status."
                  />
                ) : (
                  <>
                    {submissionsError ? (
                      <ApiStateBanner error={submissionsError} onRetry={refreshSubmissions} />
                    ) : null}
                    {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
                    <TextInput
                      multiline
                      onChangeText={setContent}
                      placeholder="Write your text response for this mission..."
                      placeholderTextColor="#91A09F"
                      style={styles.textArea}
                      textAlignVertical="top"
                      value={content}
                    />
                    <Pressable
                      disabled={submitting}
                      onPress={handleSubmit}
                      style={[styles.submitButton, submitting && styles.buttonDisabled]}
                    >
                      {submitting ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <>
                          <Ionicons color="#FFFFFF" name="send" size={16} />
                          <Text style={styles.submitLabel}>Submit Response</Text>
                        </>
                      )}
                    </Pressable>
                  </>
                )}
              </View>

              {isAuthenticated && missionSubmissions.length > 0 ? (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Previous Submissions</Text>
                  {missionSubmissions.map((item, index) => (
                    <Pressable
                      key={item.id}
                      onPress={() => router.push(`/submission/${item.id}`)}
                      style={[styles.submissionRow, index > 0 && styles.divider]}
                    >
                      <View style={styles.submissionBody}>
                        <Text numberOfLines={2} style={styles.submissionPreview}>
                          {item.content}
                        </Text>
                        <Text style={styles.submissionMeta}>
                          {item.status} · {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                      <Ionicons color="#6E7B80" name="chevron-forward" size={18} />
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F7FAF8', flex: 1 },
  flex: { flex: 1 },
  content: { padding: 20, paddingBottom: 36 },
  sectionGap: { marginTop: 16 },
  loadingBox: { alignItems: 'center', flexDirection: 'row', gap: 10, paddingVertical: 16 },
  loadingText: { color: '#64767B', fontSize: 13 },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E6EEEC',
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 14,
    padding: 16,
  },
  cardTitle: { color: '#173038', fontSize: 16, fontWeight: '800', marginBottom: 8 },
  summary: { color: '#41555C', fontSize: 14, lineHeight: 20, marginBottom: 14 },
  instructions: { color: '#2B3F46', fontSize: 14, lineHeight: 21 },
  rubricHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  rubricVersion: {
    backgroundColor: '#E7F7F0',
    borderRadius: 10,
    color: '#138E62',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  criterionRow: { paddingVertical: 10 },
  divider: { borderTopColor: '#EDF2F0', borderTopWidth: 1 },
  criterionTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  criterionTitle: { color: '#20333A', flex: 1, fontSize: 14, fontWeight: '700' },
  criterionMeta: { color: '#64767B', fontSize: 11, fontWeight: '600' },
  criterionDesc: { color: '#5F7177', fontSize: 12, lineHeight: 18, marginTop: 4 },
  textArea: {
    backgroundColor: '#F7FAF8',
    borderColor: '#DCE7E4',
    borderRadius: 14,
    borderWidth: 1,
    color: '#173038',
    fontSize: 14,
    minHeight: 130,
    padding: 12,
  },
  errorText: { color: '#922B21', fontSize: 12, marginBottom: 8 },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#16B276',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 8,
    height: 46,
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonDisabled: { opacity: 0.5 },
  submitLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  submissionRow: { alignItems: 'center', flexDirection: 'row', paddingVertical: 10 },
  submissionBody: { flex: 1, marginRight: 8 },
  submissionPreview: { color: '#20333A', fontSize: 13, fontWeight: '600' },
  submissionMeta: { color: '#75858A', fontSize: 11, marginTop: 4 },
});
