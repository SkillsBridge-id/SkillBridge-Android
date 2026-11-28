import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** @typedef {React.ComponentProps<typeof Ionicons>['name']} IoniconName */
/** @type {Array<{ icon: IoniconName, lessons: number, title: string }>} */
const practiceSets = [
  { icon: 'briefcase-outline', lessons: 6, title: 'Workplace Basics' },
  { icon: 'chatbubbles-outline', lessons: 4, title: 'Communication' },
  { icon: 'analytics-outline', lessons: 5, title: 'Business Thinking' },
];

export default function PracticeScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Practice</Text>
        <Text style={styles.subtitle}>
          Build confidence with focused, bite-sized challenges.
        </Text>

        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons color="#16B276" name="school" size={34} />
          </View>
          <Text style={styles.heroEyebrow}>TODAY&apos;S PRACTICE</Text>
          <Text style={styles.heroTitle}>Economic Policy Basics</Text>
          <Text style={styles.heroText}>3 questions · About 5 minutes</Text>
          <Pressable onPress={() => router.push('/quiz')} style={styles.primaryButton}>
            <Ionicons color="#FFFFFF" name="play" size={17} />
            <Text style={styles.primaryLabel}>Start practice</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Practice sets</Text>
          <Text style={styles.sectionMeta}>15 lessons</Text>
        </View>

        {practiceSets.map((item, index) => (
          <Pressable
            key={item.title}
            onPress={() => router.push('/quiz')}
            style={({ pressed }) => [styles.rowCard, pressed && styles.pressed]}
          >
            <View style={styles.rowIcon}>
              <Ionicons color="#16A873" name={item.icon} size={23} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.rowMeta}>{item.lessons} lessons</Text>
            </View>
            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>{index + 1}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F7FAF8', flex: 1 },
  content: { padding: 22, paddingBottom: 30 },
  title: { color: '#12212C', fontSize: 29, fontWeight: '800' },
  subtitle: { color: '#68777D', fontSize: 14, lineHeight: 20, marginTop: 6 },
  heroCard: {
    alignItems: 'center',
    backgroundColor: '#E7F7F0',
    borderRadius: 24,
    marginTop: 22,
    padding: 22,
  },
  heroIcon: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  heroEyebrow: {
    color: '#138E62',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginTop: 15,
  },
  heroTitle: {
    color: '#173038',
    fontSize: 21,
    fontWeight: '800',
    marginTop: 7,
    textAlign: 'center',
  },
  heroText: { color: '#64767B', fontSize: 13, marginTop: 6 },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#16B276',
    borderRadius: 22,
    flexDirection: 'row',
    marginTop: 18,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  primaryLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginLeft: 8 },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 25,
  },
  sectionTitle: { color: '#182A31', fontSize: 18, fontWeight: '800' },
  sectionMeta: { color: '#7B898E', fontSize: 12 },
  rowCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E6EEEC',
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 11,
    padding: 14,
  },
  rowIcon: {
    alignItems: 'center',
    backgroundColor: '#E6F7F1',
    borderRadius: 13,
    height: 46,
    justifyContent: 'center',
    marginRight: 13,
    width: 46,
  },
  rowBody: { flex: 1 },
  rowTitle: { color: '#20333A', fontSize: 15, fontWeight: '700' },
  rowMeta: { color: '#75858A', fontSize: 12, marginTop: 4 },
  numberBadge: {
    alignItems: 'center',
    backgroundColor: '#F1F5F4',
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  numberText: { color: '#5E7076', fontSize: 12, fontWeight: '700' },
  pressed: { opacity: 0.7 },
});
