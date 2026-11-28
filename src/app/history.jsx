import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { skillBridgeApi } from '../api/skillbridge';
import { useAuth } from '../auth/AuthContext';
import ApiStateBanner from '../components/ApiStateBanner';
import ScreenHeader from '../components/ScreenHeader';
import { useApiResource } from '../hooks/useApiResource';

export default function LearningHistoryScreen() {
  const { isAuthenticated } = useAuth();

  const {
    data: activity,
    error: activityError,
    loading: activityLoading,
    refresh: refreshActivity,
  } = useApiResource(skillBridgeApi.getActivity, { enabled: isAuthenticated });

  const {
    data: submissions,
    error: submissionsError,
    loading: submissionsLoading,
    refresh: refreshSubmissions,
  } = useApiResource(skillBridgeApi.getSubmissions, { enabled: isAuthenticated });

  const handleRetry = () => {
    refreshActivity();
    refreshSubmissions();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader subtitle="Daily activity and mission submissions" title="Learning History" />

        <View style={styles.bannerWrap}>
          <ApiStateBanner
            error={activityError ?? submissionsError}
            isAuthenticated={isAuthenticated}
            onRetry={handleRetry}
            signInMessage="Sign in to view your activity history and past submissions."
          />
        </View>

        {isAuthenticated && (activityLoading || submissionsLoading) && !activity && !submissions ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#16B276" />
            <Text style={styles.loadingText}>Loading learning history…</Text>
          </View>
        ) : null}

        {isAuthenticated ? (
          <>
            <Text style={styles.sectionTitle}>Daily Activity</Text>
            <View style={styles.card}>
              {activity && activity.length > 0 ? (
                activity.map((entry, index) => (
                  <View key={entry.date} style={[styles.row, index > 0 && styles.divider]}>
                    <View style={styles.rowBody}>
                      <Text style={styles.rowTitle}>{entry.date}</Text>
                      <Text style={styles.rowMeta}>
                        {entry.submissionsCompleted} submission
                        {entry.submissionsCompleted === 1 ? '' : 's'}
                      </Text>
                    </View>
                    <Text style={styles.xpBadge}>{entry.xpEarned} XP</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No recorded activity days yet.</Text>
              )}
            </View>

            <Text style={styles.sectionTitle}>Submissions</Text>
            <View style={styles.card}>
              {submissions && submissions.length > 0 ? (
                submissions.map((item, index) => (
                  <Pressable
                    key={item.id}
                    onPress={() => router.push(`/submission/${item.id}`)}
                    style={[styles.row, index > 0 && styles.divider]}
                  >
                    <View style={styles.rowBody}>
                      <Text numberOfLines={2} style={styles.rowTitle}>
                        {item.content}
                      </Text>
                      <Text style={styles.rowMeta}>
                        {item.status} · {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <Ionicons color="#6E7B80" name="chevron-forward" size={18} />
                  </Pressable>
                ))
              ) : (
                <Text style={styles.emptyText}>No submissions yet. Pick a mission on Explore!</Text>
              )}
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
  sectionTitle: { color: '#173038', fontSize: 17, fontWeight: '800', marginTop: 18 },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E6EEEC',
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  row: { alignItems: 'center', flexDirection: 'row', paddingVertical: 12 },
  divider: { borderTopColor: '#EDF2F0', borderTopWidth: 1 },
  rowBody: { flex: 1, marginRight: 10 },
  rowTitle: { color: '#20333A', fontSize: 14, fontWeight: '700' },
  rowMeta: { color: '#6E7E83', fontSize: 12, marginTop: 3 },
  xpBadge: {
    backgroundColor: '#E7F7F0',
    borderRadius: 10,
    color: '#138E62',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  emptyText: { color: '#64767B', fontSize: 13, paddingVertical: 12 },
});
