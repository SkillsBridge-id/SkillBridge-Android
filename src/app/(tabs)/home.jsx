import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { skillBridgeApi } from '../../api/skillbridge';
import { useAuth } from '../../auth/AuthContext';
import ApiStateBanner from '../../components/ApiStateBanner';
import { useApiResource } from '../../hooks/useApiResource';

const mascotImageUrl = 'https://placehold.co/600x600.png';

export default function HomeScreen() {
  const { isAuthenticated } = useAuth();

  const {
    data: profile,
    error: profileError,
    refresh: refreshProfile,
  } = useApiResource(skillBridgeApi.getProfile, { enabled: isAuthenticated });

  const {
    data: dashboard,
    error: dashboardError,
    refresh: refreshDashboard,
  } = useApiResource(skillBridgeApi.getDashboard, { enabled: isAuthenticated });

  const {
    data: recommendations,
    error: recommendationsError,
    refresh: refreshRecommendations,
  } = useApiResource(skillBridgeApi.getRecommendations, { enabled: isAuthenticated });

  const {
    data: achievements,
    error: achievementsError,
    refresh: refreshAchievements,
  } = useApiResource(skillBridgeApi.getAchievements, { enabled: isAuthenticated });

  const progression = dashboard?.progression;
  const dailyGoal = progression?.dailyGoal;
  const targetXp = dailyGoal?.targetXp ?? 0;
  const earnedXp = dailyGoal?.earnedXp ?? 0;
  const dailyPercent = targetXp > 0 ? Math.min(100, Math.round((earnedXp / targetXp) * 100)) : 0;
  const unlockedCount = (achievements ?? []).filter((item) => item.unlocked).length;
  const topRecommendation = recommendations?.recommendations[0] ?? null;

  const handleRetry = () => {
    refreshProfile();
    refreshDashboard();
    refreshRecommendations();
    refreshAchievements();
  };

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, {profile?.displayName || 'Learner'}!</Text>
            <Text style={styles.tagline}>
              {progression?.policyStatus === 'provisional'
                ? 'Progression policy is provisional'
                : 'Keep going to level up!'}
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Learning History"
            onPress={() => router.push('/history')}
            style={styles.iconButton}
          >
            <Ionicons color="#16303A" name="notifications-outline" size={23} />
            {dashboard?.summary.totalSubmissions ? <View style={styles.notificationDot} /> : null}
          </Pressable>
        </View>

        <ApiStateBanner
          error={profileError ?? dashboardError ?? recommendationsError ?? achievementsError}
          isAuthenticated={isAuthenticated}
          onRetry={handleRetry}
        />

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/progress')}
          style={styles.cardShadow}
        >
          <LinearGradient
            colors={['#EBF8F8', '#EBF8F8', '#DAF4E6', '#DAF4E6']}
            end={{ x: 0.5, y: 1 }}
            locations={[0, 0.47, 0.84, 1]}
            start={{ x: 0.5, y: 0 }}
            style={styles.levelCard}
          >
            <Text style={styles.levelLabel}>Level {progression?.level ?? 1}</Text>
            <Text style={styles.levelProgress}>
              {progression?.totalXp ?? 0} XP · {earnedXp} / {targetXp} today
            </Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${dailyPercent}%` }]} />
            </View>
            <Image
              accessibilityLabel="SkillBridge mascot"
              resizeMode="cover"
              source={{ uri: profile?.avatarUrl || mascotImageUrl }}
              style={styles.mascot}
            />
          </LinearGradient>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/progress')}
          style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}
        >
          <View style={styles.challengeIcon}>
            <Ionicons color="#F0A41B" name="calendar" size={25} />
          </View>
          <View style={styles.actionBody}>
            <Text style={styles.actionTitle}>Daily Goal</Text>
            <Text style={styles.actionSubtitle}>
              {dailyGoal?.completed
                ? 'Daily goal completed!'
                : `${dailyGoal?.remainingXp ?? 0} XP remaining today`}
            </Text>
            <View style={styles.miniProgressRow}>
              <View style={styles.miniTrack}>
                <View style={[styles.miniFill, { width: `${dailyPercent}%` }]} />
              </View>
              <Text style={styles.miniCount}>{dailyPercent}%</Text>
            </View>
          </View>
          <Ionicons color="#6E7B80" name="chevron-forward" size={20} />
        </Pressable>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          <Pressable onPress={() => router.push('/journey')}>
            <Text style={styles.sectionLink}>View journey</Text>
          </Pressable>
        </View>

        <View style={styles.learningCard}>
          <View style={styles.courseArtwork}>
            <Ionicons color="#16B276" name="stats-chart" size={34} />
          </View>
          <View style={styles.courseBody}>
            <Text numberOfLines={2} style={styles.courseTitle}>
              {topRecommendation?.title ?? 'Explore Missions'}
            </Text>
            <Text numberOfLines={2} style={styles.courseMeta}>
              {topRecommendation?.reason ??
                `${dashboard?.summary.completedMissions ?? 0} completed · ${dashboard?.summary.publishedMissionsAvailable ?? 0} available`}
            </Text>
            <Pressable
              onPress={() =>
                router.push(
                  topRecommendation ? `/mission/${topRecommendation.missionId}` : '/explore',
                )
              }
              style={styles.continueButton}
            >
              <Text style={styles.continueLabel}>
                {topRecommendation ? 'Open Mission' : 'Browse'}
              </Text>
              <Ionicons color="#FFFFFF" name="arrow-forward" size={16} />
            </Pressable>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/rewards')}
          style={({ pressed }) => [styles.rewardsCard, pressed && styles.pressed]}
        >
          <View style={styles.rewardBadge}>
            <Ionicons color="#E9A10D" name="trophy" size={25} />
          </View>
          <View style={styles.actionBody}>
            <Text style={styles.actionTitle}>Your Rewards</Text>
            <Text style={styles.actionSubtitle}>
              {unlockedCount} unlocked · {progression?.currentStreak ?? 0}-day streak
            </Text>
          </View>
          <Ionicons color="#6E7B80" name="chevron-forward" size={20} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#F7FAF8',
    flex: 1,
  },
  content: {
    paddingBottom: 28,
    paddingHorizontal: 22,
    paddingTop: 18,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  greeting: {
    color: '#12212C',
    fontFamily: 'sans-serif',
    fontSize: 27,
    fontWeight: '800',
  },
  tagline: {
    color: '#637178',
    fontFamily: 'sans-serif',
    fontSize: 14,
    marginTop: 5,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E6EFEC',
    borderRadius: 18,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    position: 'relative',
    width: 42,
  },
  notificationDot: {
    backgroundColor: '#16B276',
    borderColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    height: 7,
    position: 'absolute',
    right: 8,
    top: 7,
    width: 7,
  },
  cardShadow: {
    borderRadius: 24,
    elevation: 2,
    height: 158,
    marginBottom: 18,
    shadowColor: '#12202C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  levelCard: {
    borderRadius: 24,
    flex: 1,
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  levelLabel: {
    color: '#2B3D44',
    fontFamily: 'sans-serif',
    fontSize: 27,
    fontWeight: '800',
  },
  levelProgress: {
    color: '#2B3D44',
    fontFamily: 'sans-serif',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
  },
  progressTrack: {
    backgroundColor: '#C9EBE3',
    borderRadius: 6,
    height: 11,
    marginTop: 16,
    overflow: 'hidden',
    width: 190,
  },
  progressFill: {
    backgroundColor: '#16B276',
    borderRadius: 6,
    height: '100%',
  },
  mascot: {
    bottom: -7,
    height: 145,
    position: 'absolute',
    right: -7,
    width: 145,
  },
  actionCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E7EFEC',
    borderRadius: 18,
    borderWidth: 1,
    elevation: 1,
    flexDirection: 'row',
    marginBottom: 24,
    padding: 15,
    shadowColor: '#173C35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  challengeIcon: {
    alignItems: 'center',
    backgroundColor: '#FFF3CF',
    borderRadius: 13,
    height: 48,
    justifyContent: 'center',
    marginRight: 13,
    width: 48,
  },
  actionBody: { flex: 1 },
  actionTitle: { color: '#1B2E35', fontSize: 15, fontWeight: '800' },
  actionSubtitle: { color: '#6A7A80', fontSize: 12, marginTop: 3 },
  miniProgressRow: { alignItems: 'center', flexDirection: 'row', gap: 10, marginTop: 8 },
  miniTrack: {
    backgroundColor: '#E5EFEA',
    borderRadius: 4,
    flex: 1,
    height: 7,
    overflow: 'hidden',
  },
  miniFill: { backgroundColor: '#16B276', borderRadius: 4, height: '100%' },
  miniCount: { color: '#5E7076', fontSize: 11, fontWeight: '700' },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { color: '#182A31', fontSize: 18, fontWeight: '800' },
  sectionLink: { color: '#16A873', fontSize: 13, fontWeight: '700' },
  learningCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E7EFEC',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 18,
    padding: 16,
  },
  courseArtwork: {
    alignItems: 'center',
    backgroundColor: '#E7F7F0',
    borderRadius: 16,
    height: 72,
    justifyContent: 'center',
    marginRight: 14,
    width: 72,
  },
  courseBody: { flex: 1 },
  courseTitle: { color: '#1B2E35', fontSize: 15, fontWeight: '800' },
  courseMeta: { color: '#6A7A80', fontSize: 12, marginTop: 4 },
  continueButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#16B276',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  continueLabel: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  rewardsCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E7EFEC',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 15,
  },
  rewardBadge: {
    alignItems: 'center',
    backgroundColor: '#FFF3CF',
    borderRadius: 13,
    height: 48,
    justifyContent: 'center',
    marginRight: 13,
    width: 48,
  },
  pressed: { opacity: 0.75 },
});
