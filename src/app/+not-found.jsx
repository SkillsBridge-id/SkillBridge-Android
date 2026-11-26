import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Text style={styles.title}>Page not found</Text>
        <Link href="/" style={styles.link}>Return to SkillBridge</Link>
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
    padding: 24,
  },
  title: {
    color: '#11474F',
    fontFamily: 'MarlinSoftBasicBlack',
    fontSize: 28,
    marginBottom: 16,
  },
  link: {
    color: '#15AD76',
    fontFamily: 'MarlinSoftBasic',
    fontSize: 18,
  },
});
