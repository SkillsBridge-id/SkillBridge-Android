import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { skillBridgeApi } from '../api/skillbridge';
import { useAuth } from '../auth/AuthContext';
import ApiStateBanner from '../components/ApiStateBanner';
import ScreenHeader from '../components/ScreenHeader';
import { useApiResource } from '../hooks/useApiResource';

export default function RewardsScreen() {
  const { isAuthenticated } = useAuth();

  const {
    data: progress,
    error: progressError,
    refresh: refreshProgress,
  } = useApiResource(skillBridgeApi.getProgress, { enabled: isAuthenticated });

  const {
    data: achievements,
    error: achievementsError,
    refresh: refreshAchievements,
  } = useApiResource(skillBridgeApi.getAchievements, { enabled: isAuthenticated });

  const unlockedCount = (achievements ?? []).filter((item) => item.unlocked).length;
  const stats = [
    { icon: /** @type {const} */ ('flash'), label: 'Total XP', value: String(progress?.totalXp ?? 0) },
    { icon: /** @type {const} */ ('flame'), label: 'Day Streak', value: String(progress?.currentStreak ?? 0) },
    { icon: /** @type {const} */ ('trophy'), label: 'Unlocked', value: String(unlockedCount) },
  ];

  const handleRetry = () => {
    refreshProgress();
    refreshAchievements();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Rewards" />

        <View style={styles.bannerWrap}>
          <ApiStateBanner
            error={progressError ?? achievementsError}
            isAuthenticated={isAuthenticated}
            onRetry={handleRetry}
          />
        </View>

        <View style={styles.hero}>
          <View style={styles.starBurst}>
            <Ionicons color="#F2B31F" name="star" size={62} />
          </View>
          <View style={styles.ribbon}>
            <Text style={styles.ribbonText}>Level {progress?.level ?? 1}</Text>
          </View>
          <Text style={styles.heading}>
            {progress?.policyStatus === 'provisional'
              ? 'Provisional Progression'
              : `Level ${progress?.level ?? 1} Progress`}
          </Text>
          <Text style={styles.description}>
            {progress?.policyStatus === 'provisional'
              ? 'Effective XP rewards are 0 and achievements remain locked while the progression policy is provisional.'
              : 'Keep completing missions to unlock achievements and grow your skills.'}
          </Text>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Ionicons color="#F2AD1B" name={stat.icon} size={24} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <Text style={styles.sectionMeta}>
            {unlockedCount} / {achievements?.length ?? 0}
          </Text>
        </View>

        <View style={styles.achievementsCard}>
          {achievements && achievements.length > 0 ? (
            achievements.map((item, index) => (
              <View key={item.code} style={[styles.achievementRow, index > 0 && styles.divider]}>
                <View style={[styles.badge, !item.unlocked && styles.badgeLocked]}>
                  <Ionicons
                    color={item.unlocked ? '#F1A915' : '#9AA9A6'}
                    name={item.unlocked ? 'trophy' : 'lock-closed-outline'}
                    size={22}
                  />
                </View>
                <View style={styles.achievementBody}>
                  <Text style={styles.achievementTitle}>{item.title}</Text>
                  <Text style={styles.achievementDesc}>{item.description}</Text>
                </View>
                <Text style={styles.achievementStatus}>
                  {item.unlocked ? 'Unlocked' : 'Locked'}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              {isAuthenticated ? 'No achievements configured.' : 'Sign in to view achievements.'}
            </Text>
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
  hero: { alignItems: 'center', marginTop: 18 },
  starBurst: {
    alignItems: 'center',
    backgroundColor: '#FFF2B8',
    borderRadius: 52,
    height: 104,
    justifyContent: 'center',
    width: 104,
  },
  ribbon: {
    backgroundColor: '#F5B522',
    borderRadius: 12,
    marginTop: -15,
    paddingHorizontal: 28,
    paddingVertical: 7,
  },
  ribbonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  heading: {
    color: '#1A2E35',
    fontSize: 21,
    fontWeight: '900',
    marginTop: 18,
    textAlign: 'center',
  },
  description: {
    color: '#68777D',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    maxWidth: 300,
    textAlign: 'center',
  },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 24 },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EFED',
    borderRadius: 17,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 15,
  },
  statValue: { color: '#263A41', fontSize: 16, fontWeight: '800', marginTop: 6 },
  statLabel: { color: '#76858A', fontSize: 10, marginTop: 2 },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 26,
  },
  sectionTitle: { color: '#1D3037', fontSize: 17, fontWeight: '800' },
  sectionMeta: { color: '#6E7E83', fontSize: 12, fontWeight: '700' },
  achievementsCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EFED',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  achievementRow: { alignItems: 'center', flexDirection: 'row', gap: 12, paddingVertical: 12 },
  divider: { borderTopColor: '#EDF2F0', borderTopWidth: 1 },
  badge: {
    alignItems: 'center',
    backgroundColor: '#FFF7DF',
    borderRadius: 14,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  badgeLocked: { backgroundColor: '#F5F8F7' },
  achievementBody: { flex: 1 },
  achievementTitle: { color: '#1F3239', fontSize: 14, fontWeight: '700' },
  achievementDesc: { color: '#6E7E83', fontSize: 12, marginTop: 2 },
  achievementStatus: { color: '#64767B', fontSize: 11, fontWeight: '700' },
  emptyText: { color: '#64767B', fontSize: 13, paddingVertical: 14 },
});
