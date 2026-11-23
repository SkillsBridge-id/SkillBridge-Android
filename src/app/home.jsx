import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const userName = 'Name';
const mascotImageUrl = 'https://placehold.co/600x400';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Text style={styles.greeting}>Hi, {userName}</Text>
        <Text style={styles.levelTagline}>Keep going to level up!</Text>
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
            accessibilityLabel="SkillsBridge mascot placeholder"
            source={{ uri: mascotImageUrl }}
            style={styles.mascot}
          />
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F4',
  },
  content: {
    alignItems: 'flex-start',
    paddingHorizontal: 32,
    paddingTop: 56,
  },
  greeting: {
    color: '#12212C',
    fontFamily: 'sans-serif',
    fontSize: 28,
    fontWeight: '700',
  },
  levelCard: {
    alignItems: 'flex-start',
    alignSelf: 'center',
    borderRadius: 24,
    height: 144,
    justifyContent: 'flex-start',
    marginTop: 24,
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingTop: 18,
    width: '100%',
  },
  levelLabel: {
    color: '#2B3D44',
    fontFamily: 'sans-serif',
    fontSize: 28,
    fontWeight: '800',
  },
  levelProgress: {
    color: '#2B3D44',
    fontFamily: 'sans-serif',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
  },
  progressTrack: {
    backgroundColor: '#C9EBE3',
    borderRadius: 6,
    height: 12,
    marginTop: 12,
    overflow: 'hidden',
    width: 160,
  },
  progressFill: {
    backgroundColor: '#16B276',
    borderRadius: 6,
    height: '100%',
    width: '68%',
  },
  levelTagline: {
    color: '#636E76',
    fontFamily: 'sans-serif',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  mascot: {
    bottom: 10,
    height: 76,
    position: 'absolute',
    right: 14,
    width: 114,
  },
});
