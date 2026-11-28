import { Ionicons } from '@expo/vector-icons';
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
import { useApiResource } from '../../hooks/useApiResource';

const categories = ['All', 'Business', 'Technology', 'Communication'];
/** @typedef {React.ComponentProps<typeof Ionicons>['name']} IoniconName */
/** @typedef {{ category: string, color: string, icon: IoniconName, level: string, minutes: number, title: string }} Course */
/** @type {Course[]} */
const courses = [
  {
    category: 'Business',
    color: '#DDF4EE',
    icon: 'storefront-outline',
    level: 'Beginner',
    minutes: 5,
    title: 'Digital Economy in Indonesia',
  },
  {
    category: 'Business',
    color: '#FFF2C7',
    icon: 'bulb-outline',
    level: 'Intermediate',
    minutes: 7,
    title: 'Entrepreneurship Mindset',
  },
  {
    category: 'Technology',
    color: '#EAE7FF',
    icon: 'analytics-outline',
    level: 'Intermediate',
    minutes: 10,
    title: 'Data for Better Decisions',
  },
  {
    category: 'Communication',
    color: '#FFE8DE',
    icon: 'chatbubbles-outline',
    level: 'Beginner',
    minutes: 6,
    title: 'Workplace Communication',
  },
];

export default function ExploreScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const { data: missions, error, loading, refresh } = useApiResource(
    skillBridgeApi.getMissions,
  );

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    /** @type {Course[]} */
    const availableCourses = missions?.length
      ? missions.map((mission) => ({
          category: 'Business',
          color: '#DDF4EE',
          icon: 'book-outline',
          level: mission.status === 'published' ? 'Available' : mission.status,
          minutes: 5,
          title: mission.title,
        }))
      : courses;

    return availableCourses.filter((course) => {
      const matchesCategory =
        activeCategory === 'All' || course.category === activeCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        course.title.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, missions, query]);

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
          Find short lessons built for your next career step.
        </Text>

        <View style={styles.searchBox}>
          <Ionicons color="#63747A" name="search" size={20} />
          <TextInput
            accessibilityLabel="Search skills"
            onChangeText={setQuery}
            placeholder="Search skills..."
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
          {categories.map((category) => {
            const isActive = category === activeCategory;

            return (
              <Pressable
                key={category}
                onPress={() => setActiveCategory(category)}
                style={[styles.chip, isActive && styles.chipActive]}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Recommended for you</Text>
          <Text style={styles.resultCount}>{filteredCourses.length} lessons</Text>
        </View>

        {error ? (
          <Pressable onPress={refresh} style={styles.apiNotice}>
            <Ionicons color="#64767B" name="cloud-offline-outline" size={18} />
            <Text style={styles.apiNoticeText}>
              Backend unavailable. Showing starter lessons. Tap to retry.
            </Text>
          </Pressable>
        ) : null}

        {loading && !missions ? (
          <Text style={styles.loadingText}>Loading mission catalog…</Text>
        ) : null}

        {filteredCourses.map((course) => (
          <Pressable
            key={course.title}
            style={({ pressed }) => [styles.courseCard, pressed && styles.pressed]}
          >
            <View style={[styles.courseIcon, { backgroundColor: course.color }]}>
              <Ionicons color="#16A873" name={course.icon} size={27} />
            </View>
            <View style={styles.courseBody}>
              <Text numberOfLines={2} style={styles.courseTitle}>
                {course.title}
              </Text>
              <Text style={styles.courseMeta}>
                {course.minutes} min · {course.level}
              </Text>
            </View>
            <Ionicons color="#53666C" name="chevron-forward" size={21} />
          </Pressable>
        ))}

        {filteredCourses.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons color="#89A49D" name="search-outline" size={34} />
            <Text style={styles.emptyTitle}>No lessons found</Text>
            <Text style={styles.emptyText}>Try another search or category.</Text>
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
    marginTop: 3,
  },
  sectionTitle: {
    color: '#182A31',
    fontFamily: 'sans-serif',
    fontSize: 17,
    fontWeight: '800',
  },
  resultCount: {
    color: '#7A898E',
    fontFamily: 'sans-serif',
    fontSize: 12,
  },
  apiNotice: {
    alignItems: 'center',
    backgroundColor: '#EEF4F2',
    borderRadius: 13,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 11,
  },
  apiNoticeText: {
    color: '#64767B',
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    marginLeft: 8,
  },
  loadingText: { color: '#75858A', fontSize: 12, marginBottom: 12 },
  courseCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E6EEEC',
    borderRadius: 18,
    borderWidth: 1,
    elevation: 1,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 13,
    shadowColor: '#163C35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  courseIcon: {
    alignItems: 'center',
    borderRadius: 14,
    height: 54,
    justifyContent: 'center',
    marginRight: 13,
    width: 54,
  },
  courseBody: {
    flex: 1,
    paddingRight: 8,
  },
  courseTitle: {
    color: '#1B2D34',
    fontFamily: 'sans-serif',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 19,
  },
  courseMeta: {
    color: '#758389',
    fontFamily: 'sans-serif',
    fontSize: 12,
    marginTop: 5,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    color: '#24383F',
    fontFamily: 'sans-serif',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptyText: {
    color: '#76858A',
    fontFamily: 'sans-serif',
    fontSize: 13,
    marginTop: 5,
  },
  pressed: {
    opacity: 0.7,
  },
});
