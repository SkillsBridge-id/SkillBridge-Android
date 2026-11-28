import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { skillBridgeApi } from '../../api/skillbridge';
import { useAuth } from '../../auth/AuthContext';
import { useApiResource } from '../../hooks/useApiResource';

const statuses = ['All', 'Recommended', 'Published'];

export default function ExploreScreen() {
  const { isAuthenticated } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  const [query, setQuery] = useState('');

  const { data: missions, error, loading, refresh } = useApiResource(
    skillBridgeApi.getMissions,
  );
  const { data: recommendations } = useApiResource(skillBridgeApi.getRecommendations, {
    enabled: isAuthenticated,
  });

  const recommendedIds = useMemo(
    () => new Set((recommendations?.recommendations ?? []).map((item) => item.missionId)),
    [recommendations],
  );

  const filteredMissions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return (missions ?? []).filter((mission) => {
      const matchesFilter =
        activeFilter === 'All' ||
        (activeFilter === 'Recommended' && recommendedIds.has(mission.id)) ||
        (activeFilter === 'Published' && mission.status === 'published');

      const matchesQuery =
        normalizedQuery.length === 0 ||
        mission.title.toLowerCase().includes(normalizedQuery) ||
        mission.summary.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, missions, query, recommendedIds]);

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>
          Browse SkillBridge missions and submit your work.
        </Text>

        <View style={styles.searchBox}>
          <Ionicons color="#63747A" name="search" size={20} />
          <TextInput
            accessibilityLabel="Search missions"
            onChangeText={setQuery}
            placeholder="Search missions..."
            placeholderTextColor="#91A09F"
            style={styles.searchInput}
            value={query}
          />
          {query.length > 0 ? (
            <Pressable accessibilityLabel="Clear search" onPress={() => setQuery('')}>
              <Ionicons color="#63747A" name="close-circle" size={20} />
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          contentContainerStyle={styles.categories}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {statuses.map((filter) => {
            const isActive = filter === activeFilter;

            return (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                style={[styles.chip, isActive && styles.chipActive]}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Missions</Text>
          <Text style={styles.resultCount}>{filteredMissions.length} missions</Text>
        </View>

        {error ? (
          <Pressable onPress={refresh} style={styles.apiNotice}>
            <Ionicons color="#64767B" name="cloud-offline-outline" size={18} />
            <Text style={styles.apiNoticeText}>
              {error instanceof Error ? error.message : 'Backend unavailable.'} Tap to retry.
            </Text>
          </Pressable>
        ) : null}

        {loading && !missions ? (
          <Text style={styles.loadingText}>Loading mission catalog…</Text>
        ) : null}

        {filteredMissions.map((mission) => {
          const isRecommended = recommendedIds.has(mission.id);
          return (
            <Pressable
              key={mission.id}
              onPress={() => router.push(`/mission/${mission.id}`)}
              style={({ pressed }) => [styles.courseCard, pressed && styles.pressed]}
            >
              <View style={styles.courseIcon}>
                <Ionicons color="#16A873" name="book-outline" size={25} />
              </View>
              <View style={styles.courseBody}>
                <Text numberOfLines={2} style={styles.courseTitle}>
                  {mission.title}
                </Text>
                <Text numberOfLines={2} style={styles.courseMeta}>
                  {mission.summary}
                </Text>
                <Text style={styles.statusTag}>
                  {isRecommended ? 'Recommended · ' : ''}
                  {mission.status}
                </Text>
              </View>
              <Ionicons color="#53666C" name="chevron-forward" size={21} />
            </Pressable>
          );
        })}

        {!loading && filteredMissions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons color="#89A49D" name="search-outline" size={34} />
            <Text style={styles.emptyTitle}>No missions found</Text>
            <Text style={styles.emptyText}>Try another search or filter.</Text>
          </View>
        ) : null}
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
    paddingBottom: 30,
    paddingHorizontal: 22,
    paddingTop: 18,
  },
  title: {
    color: '#12212C',
    fontFamily: 'sans-serif',
    fontSize: 29,
    fontWeight: '800',
  },
  subtitle: {
    color: '#68777D',
    fontFamily: 'sans-serif',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E3ECE9',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 22,
    paddingHorizontal: 14,
  },
  searchInput: {
    color: '#1D3037',
    flex: 1,
    fontFamily: 'sans-serif',
    fontSize: 15,
    height: 50,
    marginHorizontal: 10,
  },
  categories: {
    gap: 9,
    paddingVertical: 16,
  },
  chip: {
    backgroundColor: '#EFF4F2',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  chipActive: {
    backgroundColor: '#16B276',
  },
  chipText: {
    color: '#52636A',
    fontFamily: 'sans-serif',
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  listHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { color: '#182A31', fontSize: 17, fontWeight: '800' },
  resultCount: { color: '#7B898E', fontSize: 12 },
  apiNotice: {
    alignItems: 'center',
    backgroundColor: '#EEF5F3',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
    padding: 12,
  },
  apiNoticeText: { color: '#5A6D73', flex: 1, fontSize: 12 },
  loadingText: { color: '#64767B', fontSize: 13, marginBottom: 12 },
  courseCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E6EEEC',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 11,
    padding: 14,
  },
  courseIcon: {
    alignItems: 'center',
    backgroundColor: '#DDF4EE',
    borderRadius: 14,
    height: 50,
    justifyContent: 'center',
    marginRight: 13,
    width: 50,
  },
  courseBody: { flex: 1, marginRight: 8 },
  courseTitle: { color: '#20333A', fontSize: 15, fontWeight: '700' },
  courseMeta: { color: '#6E7E83', fontSize: 12, marginTop: 4 },
  statusTag: { color: '#138E62', fontSize: 11, fontWeight: '700', marginTop: 5 },
  pressed: { opacity: 0.75 },
  emptyState: { alignItems: 'center', paddingVertical: 36 },
  emptyTitle: { color: '#1F3239', fontSize: 16, fontWeight: '700', marginTop: 10 },
  emptyText: { color: '#75858A', fontSize: 13, marginTop: 4 },
});
