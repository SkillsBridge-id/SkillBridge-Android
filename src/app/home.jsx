import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

const userName = 'Name';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Text style={styles.greeting}>Hi, {userName}</Text>
        <LinearGradient
          colors={['#EBF8F8', '#EBF8F8', '#DAF4E6', '#DAF4E6']}
          end={{ x: 0.5, y: 1 }}
          locations={[0, 0.47, 0.84, 1]}
          start={{ x: 0.5, y: 0 }}
          style={styles.levelCard}
        >
          <Text style={styles.levelLabel}>Level 12</Text>
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
    paddingTop: 88,
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
    color: '#12202C',
    fontFamily: 'sans-serif',
    fontSize: 24,
    fontWeight: '800',
  },
});
