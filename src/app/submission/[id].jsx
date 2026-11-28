import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiError } from '../../api/client';
import { skillBridgeApi } from '../../api/skillbridge';
import { useAuth } from '../../auth/AuthContext';
import ApiStateBanner from '../../components/ApiStateBanner';
import ScreenHeader from '../../components/ScreenHeader';
import { useApiResource } from '../../hooks/useApiResource';

/** @typedef {import('../../api/schema/generated').components['schemas']} Schemas */

export default function SubmissionDetailScreen() {
  const { id } = useLocalSearchParams();
  const submissionId = Array.isArray(id) ? id[0] : id;
  const { isAuthenticated } = useAuth();

  const loadSubmission = useCallback(
    /** @param {AbortSignal} signal */
    (signal) => {
      if (!submissionId) {
        return Promise.reject(new Error('Missing submission ID.'));
      }
      return skillBridgeApi.getSubmission(submissionId, signal);
    },
    [submissionId],
  );

  const {
    data: submission,
    error,
    loading,
    refresh,
  } = useApiResource(loadSubmission, { enabled: isAuthenticated });

  const [assessmentSnapshot, setAssessmentSnapshot] = useState(
    /**
     * @type {Schemas['AssessmentRequestResponse']['data']
     *   | Schemas['AssessmentStatusResponse']['data']
     *   | null}
     */ (null),
  );
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [assessmentError, setAssessmentError] = useState(/** @type {string | null} */ (null));

  const handleRequestAssessment = async () => {
    if (!submissionId) return;
    setAssessmentLoading(true);
    setAssessmentError(null);
    try {
      const result = await skillBridgeApi.requestAssessment(submissionId);
      setAssessmentSnapshot(result);
      refresh();
    } catch (err) {
      if (err instanceof ApiError && err.requestId) {
        setAssessmentError(`${err.message} (Request ID: ${err.requestId})`);
      } else {
        setAssessmentError(err instanceof Error ? err.message : 'Unable to request assessment.');
      }
    } finally {
      setAssessmentLoading(false);
    }
  };

  const handleRefreshAssessment = async () => {
    if (!submissionId) return;
    setAssessmentLoading(true);
    setAssessmentError(null);
    try {
      const result = await skillBridgeApi.getAssessment(submissionId);
      setAssessmentSnapshot(result);
      refresh();
    } catch (err) {
      if (err instanceof ApiError && err.requestId) {
        setAssessmentError(`${err.message} (Request ID: ${err.requestId})`);
      } else {
        setAssessmentError(err instanceof Error ? err.message : 'Unable to read assessment.');
      }
    } finally {
      setAssessmentLoading(false);
    }
  };

  const activeAssessment = assessmentSnapshot ?? submission?.latestAssessment ?? null;
  const processorConfigured =
    assessmentSnapshot && 'processorConfigured' in assessmentSnapshot
      ? assessmentSnapshot.processorConfigured
      : false;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          subtitle={submission ? `Status: ${submission.status}` : 'Submission details'}
          title={submission?.mission.title ?? 'Submission'}
        />

        <View style={styles.bannerWrap}>
          <ApiStateBanner
            error={error}
            isAuthenticated={isAuthenticated}
            onRetry={refresh}
            signInMessage="Sign in to view your submission and assessment status."
          />
        </View>

        {loading && !submission && isAuthenticated ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#16B276" />
            <Text style={styles.loadingText}>Loading submission…</Text>
          </View>
        ) : null}

        {submission ? (
          <>
            <View style={styles.card}>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>
                  Submitted {new Date(submission.submittedAt).toLocaleString()}
                </Text>
                <Text style={styles.metaBadge}>Rubric v{submission.rubricVersion.version}</Text>
              </View>
              <Text style={styles.cardTitle}>Response</Text>
              <Text style={styles.bodyText}>{submission.content}</Text>
              <Pressable
                onPress={() => router.push(`/mission/${submission.mission.id}`)}
                style={styles.linkRow}
              >
                <Text style={styles.linkText}>View mission instructions</Text>
                <Ionicons color="#16A873" name="chevron-forward" size={16} />
              </Pressable>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Assessment Lifecycle</Text>
              {activeAssessment ? (
                <View style={styles.assessmentInfo}>
                  <Text style={styles.assessmentLine}>
                    Status: <Text style={styles.bold}>{activeAssessment.status}</Text>
                  </Text>
                  <Text style={styles.assessmentLine}>
                    Finalized: <Text style={styles.bold}>{activeAssessment.isFinal ? 'Yes' : 'No'}</Text>
                  </Text>
                  <Text style={styles.assessmentLine}>
                    Updated: {new Date(activeAssessment.updatedAt).toLocaleString()}
                  </Text>
                </View>
              ) : (
                <Text style={styles.mutedText}>No assessment has been requested yet.</Text>
              )}

              <View style={styles.noticeBox}>
                <Ionicons color="#64767B" name="information-circle-outline" size={18} />
                <Text style={styles.noticeText}>
                  Processor configured: {String(processorConfigured)}. Assessment endpoints track
                  request and lifecycle status only; scores and feedback are not available until
                  processing and human review are enabled.
                </Text>
              </View>

              {assessmentError ? <Text style={styles.errorText}>{assessmentError}</Text> : null}

              <View style={styles.actionsRow}>
                <Pressable
                  disabled={assessmentLoading}
                  onPress={handleRequestAssessment}
                  style={[styles.primaryButton, assessmentLoading && styles.buttonDisabled]}
                >
                  {assessmentLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryLabel}>Request Assessment</Text>
                  )}
                </Pressable>
                <Pressable
                  disabled={assessmentLoading}
                  onPress={handleRefreshAssessment}
                  style={styles.secondaryButton}
                >
                  <Text style={styles.secondaryLabel}>Refresh Status</Text>
                </Pressable>
              </View>
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F7FAF8', flex: 1 },
  content: { padding: 20, paddingBottom: 32 },
  bannerWrap: { marginTop: 16 },
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
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metaText: { color: '#6E7E83', fontSize: 11 },
  metaBadge: {
    backgroundColor: '#E7F7F0',
    borderRadius: 8,
    color: '#138E62',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  cardTitle: { color: '#173038', fontSize: 16, fontWeight: '800', marginBottom: 8 },
  bodyText: { color: '#263A41', fontSize: 14, lineHeight: 21 },
  linkRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 14,
  },
  linkText: { color: '#16A873', fontSize: 13, fontWeight: '700' },
  assessmentInfo: { gap: 4, marginBottom: 12 },
  assessmentLine: { color: '#2B3F46', fontSize: 13 },
  bold: { fontWeight: '800' },
  mutedText: { color: '#64767B', fontSize: 13, marginBottom: 12 },
  noticeBox: {
    alignItems: 'flex-start',
    backgroundColor: '#EEF4F2',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    padding: 12,
  },
  noticeText: { color: '#586A70', flex: 1, fontSize: 11, lineHeight: 16 },
  errorText: { color: '#922B21', fontSize: 12, marginTop: 10 },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#16B276',
    borderRadius: 14,
    flex: 1,
    height: 44,
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  primaryLabel: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#EFF5F3',
    borderRadius: 14,
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  secondaryLabel: { color: '#173038', fontSize: 13, fontWeight: '700' },
});
