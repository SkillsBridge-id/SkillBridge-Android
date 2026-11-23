import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.description}>
          Discover new skills, learning paths, and projects to grow your
          toolkit.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F8F4',
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 32,
  },
  title: {
    color: '#12212C',
    fontFamily: 'sans-serif',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    color: '#636E76',
    fontFamily: 'sans-serif',
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
  },
});
