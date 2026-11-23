import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const userName = 'Name';
const mascotImageUrl = 'https://placehold.co/600x600.png';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Text style={styles.greeting}>Hi, {userName}</Text>
        <Text style={styles.levelTagline}>Keep going to level up!</Text>
        <View style={styles.levelCardShadow}>
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
              resizeMode="cover"
              source={{ uri: mascotImageUrl }}
              style={styles.mascot}
            />
          </LinearGradient>
        </View>
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
    flex: 1,
    alignItems: 'flex-start',
    borderRadius: 24,
    justifyContent: 'flex-start',
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  levelCardShadow: {
    alignSelf: 'center',
    borderRadius: 24,
    elevation: 2,
    height: 144,
    marginTop: 24,
    shadowColor: '#12202C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
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
    fontSize: 17,
    fontWeight: '700',
    marginTop: 5,
  },
  progressTrack: {
    backgroundColor: '#C9EBE3',
    borderRadius: 6,
    height: 12,
    marginTop: 18,
    overflow: 'hidden',
    width: 200,
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
    bottom: -8,
    height: 140,
    position: 'absolute',
    right: -8,
    width: 140,
  },
});
