import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { skillBridgeApi } from '../api/skillbridge';
import { useApiResource } from '../hooks/useApiResource';

/** @typedef {React.ComponentProps<typeof Ionicons>['name']} IoniconName */
/** @type {Array<{ color: string, icon: IoniconName, name: string, score: number }>} */
const skills = [
  { color: '#16B276', icon: 'briefcase', name: 'Business Acumen', score: 85 },
  { color: '#8F7CEB', icon: 'analytics', name: 'Data Analysis', score: 70 },
  { color: '#F2AD28', icon: 'chatbubbles', name: 'Communication', score: 72 },
  { color: '#38AEB8', icon: 'bulb', name: 'Problem Solving', score: 90 },
];

export default function ProgressScreen() {
  const { data: progress } = useApiResource(skillBridgeApi.getProgress);
  const displayedLevel = progress?.level ?? 12;
  const displayedXp = progress?.totalXp ?? 680;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Skill Progress" />
        <View style={styles.overallCard}>
          <View style={styles.circleOuter}>
            <View style={styles.circleInner}>
              <Text style={styles.percent}>78%</Text>
            </View>
          </View>
          <View style={styles.overallCopy}>
            <Text style={styles.overallTitle}>Level {displayedLevel} Progress</Text>
            <Text style={styles.growth}>↑ +12% this month</Text>
            <Text style={styles.policyNote}>
              {displayedXp} XP · Policy {progress?.policyStatus ?? 'provisional'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your Skills</Text>
        <View style={styles.skillsCard}>
          {skills.map((skill, index) => (
            <View key={skill.name} style={[styles.skillRow, index > 0 && styles.divider]}>
              <View style={[styles.skillIcon, { backgroundColor: `${skill.color}20` }]}>
                <Ionicons color={skill.color} name={skill.icon} size={20} />
              </View>
              <View style={styles.skillBody}>
                <View style={styles.skillTop}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <Text style={styles.skillScore}>{skill.score}%</Text>
                </View>
                <View style={styles.track}>
                  <View
                    style={[styles.fill, { backgroundColor: skill.color, width: `${skill.score}%` }]}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F7FAF8', flex: 1 },
  content: { padding: 20, paddingBottom: 30 },
  overallCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E6EEEC',
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 22,
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
  policyNote: { color: '#7B898E', fontSize: 10, lineHeight: 14, marginTop: 7 },
  sectionTitle: { color: '#1C3037', fontSize: 18, fontWeight: '800', marginTop: 25 },
  skillsCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E6EEEC',
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  skillRow: { alignItems: 'center', flexDirection: 'row', paddingVertical: 16 },
  divider: { borderTopColor: '#EDF2F0', borderTopWidth: 1 },
  skillIcon: {
    alignItems: 'center',
    borderRadius: 14,
    height: 44,
    justifyContent: 'center',
    marginRight: 13,
    width: 44,
  },
  skillBody: { flex: 1 },
  skillTop: { flexDirection: 'row', justifyContent: 'space-between' },
  skillName: { color: '#2A3E45', fontSize: 14, fontWeight: '700' },
  skillScore: { color: '#54666C', fontSize: 12, fontWeight: '700' },
  track: {
    backgroundColor: '#E6EFEC',
    borderRadius: 4,
    height: 7,
    marginTop: 9,
    overflow: 'hidden',
  },
  fill: { borderRadius: 4, height: '100%' },
});
