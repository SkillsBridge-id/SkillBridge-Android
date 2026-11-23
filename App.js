import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const colors = {
  background: '#F7F8F4',
  ink: '#17231B',
  muted: '#69766C',
  green: '#2F8F58',
  greenPressed: '#267448',
};

export default function App() {
  const [fontsLoaded] = useFonts({
    MarlinSoftBasic: require('./assets/fonts/FontMesa - MarlinSoftBasic-Regular.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.title}>SkillsBridge</Text>
          <Text style={styles.subtitle}>Learn. Practice. Build. Transcend.</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Get Started"
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonLabel}>Get Started</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    color: colors.ink,
    fontFamily: 'MarlinSoftBasic',
    fontSize: 46,
    fontWeight: '700',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.muted,
    fontFamily: 'MarlinSoftBasic',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.15,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 58,
    width: '100%',
  },
  buttonPressed: {
    backgroundColor: colors.greenPressed,
    transform: [{ scale: 0.985 }],
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontFamily: 'MarlinSoftBasic',
    fontSize: 18,
  },
});
