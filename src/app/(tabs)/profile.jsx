import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { skillBridgeApi } from '../../api/skillbridge';
import { useAuth } from '../../auth/AuthContext';
import ApiStateBanner from '../../components/ApiStateBanner';
import { useApiResource } from '../../hooks/useApiResource';

const mascotImageUrl = 'https://placehold.co/600x600.png';
/** @typedef {React.ComponentProps<typeof Ionicons>['name']} IoniconName */
/** @type {Array<{ icon: IoniconName, label: string, route: '/progress' | '/rewards' | '/history' | '/settings' }>} */
const menuItems = [
  { icon: 'stats-chart-outline', label: 'Skill Progress', route: '/progress' },
  { icon: 'gift-outline', label: 'Rewards', route: '/rewards' },
  { icon: 'time-outline', label: 'Learning History', route: '/history' },
  { icon: 'settings-outline', label: 'Account Settings', route: '/settings' },
];

export default function ProfileScreen() {
  const { isAuthenticated, user } = useAuth();

  const {
    data: profile,
    error: profileError,
    refresh: refreshProfile,
  } = useApiResource(skillBridgeApi.getProfile, { enabled: isAuthenticated });
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
    { icon: /** @type {const} */ ('flame'), label: 'Day Streak', value: String(progress?.currentStreak ?? 0) },
    { icon: /** @type {const} */ ('trophy'), label: 'Badges', value: String(unlockedCount) },
    { icon: /** @type {const} */ ('star'), label: 'Total XP', value: String(progress?.totalXp ?? 0) },
  ];

  const handleRetry = () => {
    refreshProfile();
    refreshProgress();
    refreshAchievements();
  };

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.pageTitle}>Profile</Text>
          <Pressable
            accessibilityLabel="Settings"
            onPress={() => router.push('/settings')}
            style={styles.settingsButton}
          >
            <Ionicons color="#253A41" name="settings-outline" size={21} />
          </Pressable>
        </View>

        <View style={styles.bannerWrap}>
          <ApiStateBanner
            error={profileError ?? progressError ?? achievementsError}
            isAuthenticated={isAuthenticated}
            onRetry={handleRetry}
          />
        </View>

        <View style={styles.identity}>
          <View style={styles.avatarRing}>
            <Image
              source={{ uri: profile?.avatarUrl || mascotImageUrl }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.name}>{profile?.displayName || 'Learner'}</Text>
          <Text style={styles.handle}>{profile?.bio || user?.email || 'Not signed in'}</Text>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Ionicons color="#16B276" name={stat.icon} size={22} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Achievements</Text>
          <Pressable onPress={() => router.push('/rewards')}>
            <Text style={styles.sectionLink}>See all</Text>
          </Pressable>
        </View>
        <View style={styles.achievementRow}>
          {(achievements ?? []).slice(0, 4).map((item) => (
            <View
              key={item.code}
              style={[styles.achievementBadge, !item.unlocked && styles.achievementLocked]}
            >
              <Ionicons
                color={item.unlocked ? '#F1AA15' : '#A8B5B2'}
                name={item.unlocked ? 'trophy' : 'lock-closed-outline'}
                size={24}
              />
            </View>
          ))}
          {(!achievements || achievements.length === 0) ? (
            <Text style={styles.emptyAchievements}>
              {isAuthenticated ? 'No achievements loaded yet.' : 'Sign in to view achievements.'}
            </Text>
          ) : null}
        </View>

        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <Pressable
              key={item.label}
              onPress={() => router.push(item.route)}
              style={[styles.menuRow, index > 0 && styles.menuDivider]}
            >
              <Ionicons color="#3A535A" name={item.icon} size={21} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons color="#76878C" name="chevron-forward" size={19} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F7FAF8', flex: 1 },
  content: { padding: 22, paddingBottom: 30 },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pageTitle: { color: '#12212C', fontSize: 29, fontWeight: '800' },
  settingsButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  bannerWrap: { marginTop: 14 },
  identity: { alignItems: 'center', marginTop: 12 },
  avatarRing: {
    alignItems: 'center',
    backgroundColor: '#E1F6ED',
    borderRadius: 48,
    height: 96,
    justifyContent: 'center',
    width: 96,
  },
  avatar: { borderRadius: 40, height: 80, width: 80 },
  name: { color: '#172A31', fontSize: 21, fontWeight: '800', marginTop: 12 },
  handle: { color: '#6B7B80', fontSize: 13, marginTop: 3, textAlign: 'center' },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 22 },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E7EFEC',
    borderRadius: 17,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 14,
  },
  statValue: { color: '#20333A', fontSize: 17, fontWeight: '800', marginTop: 6 },
  statLabel: { color: '#718086', fontSize: 10, marginTop: 2 },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 11,
    marginTop: 24,
  },
  sectionTitle: { color: '#1C3037', fontSize: 17, fontWeight: '800' },
  sectionLink: { color: '#16A873', fontSize: 12, fontWeight: '700' },
  achievementRow: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7EFEC',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 13,
  },
  achievementBadge: {
    alignItems: 'center',
    backgroundColor: '#FFF7DF',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  achievementLocked: { backgroundColor: '#F5F8F7' },
  emptyAchievements: { color: '#6B7B80', fontSize: 12 },
  menu: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7EFEC',
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 18,
    overflow: 'hidden',
    paddingHorizontal: 15,
  },
  menuRow: { alignItems: 'center', flexDirection: 'row', paddingVertical: 16 },
  menuDivider: { borderTopColor: '#EDF2F0', borderTopWidth: 1 },
  menuLabel: {
    color: '#263A41',
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
});
