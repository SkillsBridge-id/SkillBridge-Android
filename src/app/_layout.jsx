import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, View, Button } from 'react-native';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    MarlinSoftBasic: require('../../assets/fonts/FontMesa - MarlinSoftBasic-Regular.otf'),
    MarlinSoftBasicBlack: require('../../assets/fonts/FontMesa - MarlinSoftBasic-Black.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

/**
 * @param {{ error?: Error, retry: () => void }} props
 */
export function ErrorBoundary({ error, retry }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.message}>{error?.message ?? 'Please try again.'}</Text>
        <Button title="Try again" onPress={retry} color="#15AD76" />
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
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    color: '#11474F',
    fontFamily: 'MarlinSoftBasic',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});
