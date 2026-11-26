import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';

/** @typedef {React.ComponentProps<typeof Ionicons>['name']} IoniconName */
/** @type {Array<{ icon: IoniconName, left: `${number}%`, locked: boolean, top: number }>} */
const nodes = [
  { icon: 'book', left: '53%', locked: false, top: 34 },
  { icon: 'lock-closed', left: '24%', locked: true, top: 132 },
  { icon: 'lock-closed', left: '58%', locked: true, top: 222 },
  { icon: 'lock-closed', left: '35%', locked: true, top: 315 },
];

export default function JourneyScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.headerWrap}>
        <ScreenHeader subtitle="Your learning path" title="Learning Journey" />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient colors={['#BFEFD1', '#E9F7D6']} style={styles.map}>
          <View style={styles.pathOne} />
          <View style={styles.pathTwo} />
          {nodes.map((node, index) => (
            <View
              key={`${node.left}-${node.top}`}
              style={[styles.node, { left: node.left, top: node.top }, !node.locked && styles.nodeActive]}
            >
              <Ionicons
                color={node.locked ? '#8C9B9E' : '#16B276'}
                name={node.icon}
                size={index === 0 ? 28 : 21}
              />
            </View>
          ))}
          <View style={styles.chapterCard}>
            <View style={styles.chapterIcon}>
              <Ionicons color="#16A873" name="book-outline" size={23} />
            </View>
            <View style={styles.chapterCopy}>
              <Text style={styles.chapterLabel}>Chapter 1</Text>
              <Text style={styles.chapterTitle}>Introduction to Economics</Text>
            </View>
            <Pressable onPress={() => router.push('/quiz')} style={styles.startButton}>
              <Ionicons color="#FFFFFF" name="play" size={16} />
              <Text style={styles.startLabel}>Start</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F7FAF8', flex: 1 },
  headerWrap: { paddingHorizontal: 18, paddingTop: 6 },
  content: { padding: 18, paddingBottom: 30 },
  map: { borderRadius: 28, height: 540, overflow: 'hidden', position: 'relative' },
  pathOne: {
    backgroundColor: '#FFFDF0',
    borderRadius: 60,
    height: 410,
    left: '29%',
    position: 'absolute',
    top: 35,
    transform: [{ rotate: '20deg' }],
    width: 82,
  },
  pathTwo: {
    backgroundColor: '#FFFDF0',
    borderRadius: 60,
    height: 310,
    left: '45%',
    position: 'absolute',
    top: 120,
    transform: [{ rotate: '-24deg' }],
    width: 78,
  },
  node: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DCE5E1',
    borderRadius: 30,
    borderWidth: 5,
    height: 60,
    justifyContent: 'center',
    marginLeft: -30,
    position: 'absolute',
    width: 60,
  },
  nodeActive: { borderColor: '#BFEBD9', height: 70, marginLeft: -35, width: 70 },
  chapterCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    bottom: 17,
    flexDirection: 'row',
    left: 16,
    padding: 14,
    position: 'absolute',
    right: 16,
  },
  chapterIcon: {
    alignItems: 'center',
    backgroundColor: '#DFF5EC',
    borderRadius: 13,
    height: 46,
    justifyContent: 'center',
    marginRight: 11,
    width: 46,
  },
  chapterCopy: { flex: 1 },
  chapterLabel: { color: '#78868A', fontSize: 10 },
  chapterTitle: { color: '#203239', fontSize: 13, fontWeight: '700', marginTop: 3 },
  startButton: {
    alignItems: 'center',
    backgroundColor: '#16B276',
    borderRadius: 18,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  startLabel: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', marginLeft: 5 },
});
