import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { skillBridgeApi } from '../api/skillbridge';
import { useAuth } from '../auth/AuthContext';
import ApiStateBanner from '../components/ApiStateBanner';
import ScreenHeader from '../components/ScreenHeader';
import { useApiResource } from '../hooks/useApiResource';

export default function ProgressScreen() {
  const { isAuthenticated } = useAuth();

  const {
    data: progress,
    error: progressError,
    refresh: refreshProgress,
  } = useApiResource(skillBridgeApi.getProgress, { enabled: isAuthenticated });

  const {
    data: dashboard,
    error: dashboardError,
    refresh: refreshDashboard,
  } = useApiResource(skillBridgeApi.getDashboard, { enabled: isAuthenticated });

  const {
    data: activity,
    error: activityError,
    refresh: refreshActivity,
  } = useApiResource(skillBridgeApi.getActivity, { enabled: isAuthenticated });

  const displayedLevel = progress?.level ?? 1;
  const displayedXp = progress?.totalXp ?? 0;
  const targetXp = progress?.dailyGoal.targetXp ?? 0;
  const earnedXp = progress?.dailyGoal.earnedXp ?? 0;
  const dailyPercent = targetXp > 0 ? Math.min(100, Math.round((earnedXp / targetXp) * 100)) : 0;

  const handleRetry = () => {
    refreshProgress();
    refreshDashboard();
    refreshActivity();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Skill Progress" />

        <View style={styles.bannerWrap}>
          <ApiStateBanner
            error={progressError ?? dashboardError ?? activityError}
            isAuthenticated={isAuthenticated}
            onRetry={handleRetry}
          />
        </View>

        <View style={styles.overallCard}>
          <View style={styles.circleOuter}>
            <View style={styles.circleInner}>
              <Text style={styles.percent}>{dailyPercent}%</Text>
            </View>
          </View>
          <View style={styles.overallCopy}>
            <Text style={styles.overallTitle}>Level {displayedLevel}</Text>
            <Text style={styles.growth}>
              {progress?.currentStreak ?? 0}-day streak · Best {progress?.longestStreak ?? 0}
            </Text>
            <Text style={styles.policyNote}>
              {displayedXp} XP · Daily {earnedXp}/{targetXp} ({progress?.dailyGoal.timezone ?? 'UTC'}) · Policy {progress?.policyStatus ?? 'provisional'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Mission Summary</Text>
        <View style={styles.skillsCard}>
          <View style={styles.summaryRow}>
            <Ionicons color="#16B276" name="compass-outline" size={20} />
            <Text style={styles.summaryLabel}>Published missions</Text>
            <Text style={styles.summaryValue}>
              {dashboard?.summary.publishedMissionsAvailable ?? 0}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.divider]}>
            <Ionicons color="#8F7CEB" name="play-circle-outline" size={20} />
            <Text style={styles.summaryLabel}>Started missions</Text>
            <Text style={styles.summaryValue}>{dashboard?.summary.startedMissions ?? 0}</Text>
          </View>
          <View style={[styles.summaryRow, styles.divider]}>
            <Ionicons color="#F2AD28" name="checkmark-done-outline" size={20} />
            <Text style={styles.summaryLabel}>Completed missions</Text>
            <Text style={styles.summaryValue}>{dashboard?.summary.completedMissions ?? 0}</Text>
          </View>
          <View style={[styles.summaryRow, styles.divider]}>
            <Ionicons color="#38AEB8" name="document-text-outline" size={20} />
            <Text style={styles.summaryLabel}>Total submissions</Text>
            <Text style={styles.summaryValue}>{dashboard?.summary.totalSubmissions ?? 0}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Daily Activity</Text>
        <View style={styles.skillsCard}>
          {activity && activity.length > 0 ? (
            activity.slice(0, 7).map((entry, index) => (
              <View key={entry.date} style={[styles.summaryRow, index > 0 && styles.divider]}>
                <Text style={styles.summaryLabel}>{entry.date}</Text>
                <Text style={styles.summaryValue}>
                  {entry.submissionsCompleted} sub · {entry.xpEarned} XP
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No recent daily activity recorded.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F7FAF8', flex: 1 },
  content: { padding: 20, paddingBottom: 30 },
  bannerWrap: { marginTop: 14 },
  overallCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E6EEEC',
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 10,
    padding: 20,
  },
  circleOuter: {
    alignItems: 'center',
    borderColor: '#16B276',
    borderRadius: 52,
    borderRightColor: '#D8EEE8',
    borderWidth: 10,
    height: 104,
    justifyContent: 'center',
    width: 104,
  },
  circleInner: { alignItems: 'center', justifyContent: 'center' },
  percent: { color: '#16343A', fontSize: 27, fontWeight: '900' },
  overallCopy: { flex: 1, marginLeft: 18 },
  overallTitle: { color: '#1C3037', fontSize: 17, fontWeight: '800' },
  growth: { color: '#16A873', fontSize: 13, fontWeight: '700', marginTop: 7 },
  policyNote: { color: '#7B898E', fontSize: 11, lineHeight: 15, marginTop: 7 },
  sectionTitle: { color: '#1C3037', fontSize: 18, fontWeight: '800', marginTop: 25 },
  skillsCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E6EEEC',
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  summaryRow: { alignItems: 'center', flexDirection: 'row', gap: 10, paddingVertical: 14 },
  divider: { borderTopColor: '#EDF2F0', borderTopWidth: 1 },
  summaryLabel: { color: '#2A3E45', flex: 1, fontSize: 14, fontWeight: '600' },
  summaryValue: { color: '#16343A', fontSize: 14, fontWeight: '800' },
  emptyText: { color: '#64767B', fontSize: 13, paddingVertical: 14 },
});
