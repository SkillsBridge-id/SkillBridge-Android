import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

const userName = 'Name';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Text style={styles.greeting}>Hi, {userName}</Text>
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
    paddingHorizontal: 24,
    paddingTop: 18,
  },
  greeting: {
    color: '#12212C',
    fontFamily: 'sans-serif',
    fontSize: 28,
    fontWeight: '700',
  },
});
