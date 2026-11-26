import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';

/** @typedef {React.ComponentProps<typeof Ionicons>['name']} IoniconName */
/** @type {Array<{ icon: IoniconName, label: string, value: string }>} */
const stats = [
  { icon: 'flash', label: 'XP', value: '+250' },
  { icon: 'flame', label: 'Day Streak', value: '12' },
  { icon: 'trophy', label: 'Badges', value: '8' },
];
/** @type {IoniconName[]} */
const achievementIcons = ['star', 'ribbon', 'locate', 'trophy'];

export default function RewardsScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Rewards" />

        <View style={styles.hero}>
          <View style={styles.starBurst}>
            <Ionicons color="#F2B31F" name="star" size={62} />
          </View>
          <View style={styles.ribbon}>
            <Text style={styles.ribbonText}>Level Up!</Text>
          </View>
          <Text style={styles.heading}>You&apos;ve reached Level 13!</Text>
          <Text style={styles.description}>
            Keep going to unlock more achievements and grow your skills.
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
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <Text style={styles.sectionLink}>See all</Text>
        </View>
        <View style={styles.achievements}>
          {achievementIcons.map((icon, index) => (
            <View key={icon} style={styles.badge}>
              <Ionicons
                color={['#F1A915', '#4892E8', '#EC655D', '#DDA019'][index]}
                name={icon}
                size={32}
              />
            </View>
          ))}
        </View>

        <View style={styles.notice}>
          <Ionicons color="#64767B" name="information-circle-outline" size={19} />
          <Text style={styles.noticeText}>
            Rewards remain locked while the progression policy is provisional.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F7FAF8', flex: 1 },
  content: { padding: 20, paddingBottom: 30 },
  hero: { alignItems: 'center', marginTop: 28 },
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
    maxWidth: 280,
    textAlign: 'center',
  },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 26 },
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
  sectionLink: { color: '#16A873', fontSize: 12, fontWeight: '700' },
  achievements: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EFED',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: '#F5F8F7',
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  notice: {
    alignItems: 'center',
    backgroundColor: '#EEF4F2',
    borderRadius: 14,
    flexDirection: 'row',
    marginTop: 18,
    padding: 13,
  },
  noticeText: { color: '#64767B', flex: 1, fontSize: 11, lineHeight: 16, marginLeft: 8 },
});
