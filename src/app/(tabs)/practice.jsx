import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { skillBridgeApi } from '../../api/skillbridge';
import { useAuth } from '../../auth/AuthContext';
import ApiStateBanner from '../../components/ApiStateBanner';
import { useApiResource } from '../../hooks/useApiResource';

export default function PracticeScreen() {
  const { isAuthenticated } = useAuth();

  const {
    data: missions,
    error: missionsError,
    refresh: refreshMissions,
  } = useApiResource(skillBridgeApi.getMissions);

  const { data: recommendations } = useApiResource(skillBridgeApi.getRecommendations, {
    enabled: isAuthenticated,
  });

  const topRecommendation = recommendations?.recommendations[0] ?? null;
  const heroMission = topRecommendation
    ? { id: topRecommendation.missionId, title: topRecommendation.title, subtitle: topRecommendation.reason }
    : missions?.[0]
      ? { id: missions[0].id, title: missions[0].title, subtitle: missions[0].summary }
      : null;

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Practice</Text>
        <Text style={styles.subtitle}>
          Build confidence with focused mission challenges.
        </Text>

        <View style={styles.bannerWrap}>
          <ApiStateBanner error={missionsError} onRetry={refreshMissions} />
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons color="#16B276" name="school" size={34} />
          </View>
          <Text style={styles.heroEyebrow}>
            {topRecommendation ? 'RECOMMENDED MISSION' : 'FEATURED MISSION'}
          </Text>
          <Text style={styles.heroTitle}>{heroMission?.title ?? 'Explore Missions'}</Text>
          <Text numberOfLines={3} style={styles.heroText}>
            {heroMission?.subtitle ?? 'Pick a mission to read its rubric and submit your response.'}
          </Text>
          <Pressable
            onPress={() => router.push(heroMission ? `/mission/${heroMission.id}` : '/explore')}
            style={styles.primaryButton}
          >
            <Ionicons color="#FFFFFF" name="play" size={17} />
            <Text style={styles.primaryLabel}>Start practice</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available missions</Text>
          <Text style={styles.sectionMeta}>{missions?.length ?? 0} missions</Text>
        </View>

        {(missions ?? []).map((item, index) => (
          <Pressable
            key={item.id}
            onPress={() => router.push(`/mission/${item.id}`)}
            style={({ pressed }) => [styles.rowCard, pressed && styles.pressed]}
          >
            <View style={styles.rowIcon}>
              <Ionicons color="#16A873" name="document-text-outline" size={23} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text numberOfLines={1} style={styles.rowMeta}>
                {item.summary}
              </Text>
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
  bannerWrap: { marginTop: 14 },
  heroCard: {
    alignItems: 'center',
    backgroundColor: '#E7F7F0',
    borderRadius: 24,
    marginTop: 8,
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
  heroText: { color: '#64767B', fontSize: 13, marginTop: 6, textAlign: 'center' },
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
  rowBody: { flex: 1, marginRight: 8 },
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
