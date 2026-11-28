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

const userName = 'Celine';
const mascotImageUrl = 'https://placehold.co/600x600.png';

export default function HomeScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, {userName}!</Text>
            <Text style={styles.tagline}>Keep going to level up!</Text>
          </View>
          <Pressable accessibilityLabel="Notifications" style={styles.iconButton}>
            <Ionicons color="#16303A" name="notifications-outline" size={23} />
            <View style={styles.notificationDot} />
          </Pressable>
        </View>

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
            <Text style={styles.levelLabel}>Level 12</Text>
            <Text style={styles.levelProgress}>680 / 1000 XP</Text>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
            <Image
              accessibilityLabel="SkillBridge mascot placeholder"
              resizeMode="cover"
              source={{ uri: mascotImageUrl }}
              style={styles.mascot}
            />
          </LinearGradient>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/quiz')}
          style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}
        >
          <View style={styles.challengeIcon}>
            <Ionicons color="#F0A41B" name="calendar" size={25} />
          </View>
          <View style={styles.actionBody}>
            <Text style={styles.actionTitle}>Daily Challenge</Text>
            <Text style={styles.actionSubtitle}>Complete 3 lessons today!</Text>
            <View style={styles.miniProgressRow}>
              <View style={styles.miniTrack}>
                <View style={styles.miniFill} />
              </View>
              <Text style={styles.miniCount}>1 / 3</Text>
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
            <Text style={styles.courseTitle}>Business & Entrepreneurship</Text>
            <Text style={styles.courseMeta}>65% complete</Text>
            <Pressable
              onPress={() => router.push('/journey')}
              style={styles.continueButton}
            >
              <Text style={styles.continueLabel}>Continue</Text>
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
            <Text style={styles.actionSubtitle}>8 badges and a 12-day streak</Text>
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
    fontSize: 16,
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
    width: '68%',
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
  actionBody: {
    flex: 1,
  },
  actionTitle: {
    color: '#182A31',
    fontFamily: 'sans-serif',
    fontSize: 16,
    fontWeight: '700',
  },
  actionSubtitle: {
    color: '#6B777D',
    fontFamily: 'sans-serif',
    fontSize: 12,
    marginTop: 3,
  },
  miniProgressRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 8,
  },
  miniTrack: {
    backgroundColor: '#DDEFEA',
    borderRadius: 4,
    flex: 1,
    height: 6,
    marginRight: 10,
    overflow: 'hidden',
  },
  miniFill: {
    backgroundColor: '#16B276',
    borderRadius: 4,
    height: '100%',
    width: '33%',
  },
  miniCount: {
    color: '#495B62',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#182A31',
    fontFamily: 'sans-serif',
    fontSize: 18,
    fontWeight: '800',
  },
  sectionLink: {
    color: '#16A873',
    fontFamily: 'sans-serif',
    fontSize: 12,
    fontWeight: '700',
  },
  learningCard: {
    alignItems: 'center',
    backgroundColor: '#EAF7F7',
    borderRadius: 20,
    flexDirection: 'row',
    marginBottom: 16,
    minHeight: 138,
    padding: 16,
  },
  courseArtwork: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 74,
    justifyContent: 'center',
    marginRight: 14,
    width: 74,
  },
  courseBody: {
    flex: 1,
  },
  courseTitle: {
    color: '#173038',
    fontFamily: 'sans-serif',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  courseMeta: {
    color: '#64777C',
    fontFamily: 'sans-serif',
    fontSize: 12,
    marginTop: 4,
  },
  continueButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#16B276',
    borderRadius: 18,
    flexDirection: 'row',
    marginTop: 11,
    paddingHorizontal: 17,
    paddingVertical: 9,
  },
  continueLabel: {
    color: '#FFFFFF',
    fontFamily: 'sans-serif',
    fontSize: 13,
    fontWeight: '700',
    marginRight: 6,
  },
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
    backgroundColor: '#FFF4D4',
    borderRadius: 13,
    height: 46,
    justifyContent: 'center',
    marginRight: 13,
    width: 46,
  },
  pressed: {
    opacity: 0.72,
  },
});
