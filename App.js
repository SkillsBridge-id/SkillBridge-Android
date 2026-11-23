import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const colors = {
  background: '#F7F8F4',
  ink: '#11474F',
  muted: '#11474F',
  green: '#15AD76',
  greenPressed: '#0F8E60',
};

export default function App() {
  const [fontsLoaded] = useFonts({
    MarlinSoftBasic: require('./assets/fonts/FontMesa - MarlinSoftBasic-Regular.otf'),
    MarlinSoftBasicBlack: require('./assets/fonts/FontMesa - MarlinSoftBasic-Black.otf'),
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
          <View style={styles.buttonContent}>
            <Text style={styles.buttonLabel}>Get Started</Text>
            <View style={styles.buttonArrow}>
              <View style={styles.arrowLine} />
              <View style={styles.arrowHead} />
            </View>
          </View>
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
    paddingBottom: 64,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  title: {
    color: colors.ink,
    fontFamily: 'MarlinSoftBasicBlack',
    fontSize: 46,
    fontWeight: 'normal',
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.muted,
    fontFamily: 'MarlinSoftBasic',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: 999,
    justifyContent: 'center',
    minHeight: 68,
    width: '78%',
    alignSelf: 'center',
  },
  buttonPressed: {
    backgroundColor: colors.greenPressed,
    transform: [{ scale: 0.985 }],
  },
  buttonContent: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontFamily: 'MarlinSoftBasic',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonArrow: {
    height: 16,
    marginLeft: 10,
    position: 'relative',
    width: 20,
  },
  arrowLine: {
    backgroundColor: '#FFFFFF',
    height: 2,
    left: 0,
    position: 'absolute',
    right: 1,
    top: 7,
  },
  arrowHead: {
    borderColor: '#FFFFFF',
    borderRightWidth: 2,
    borderTopWidth: 2,
    height: 9,
    position: 'absolute',
    right: 0,
    top: 3,
    transform: [{ rotate: '45deg' }],
    width: 9,
  },
});
