import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

/**
 * @param {{ subtitle?: string, title: string }} props
 */
export default function ScreenHeader({ subtitle, title }) {
  return (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.backButton}>
        <Ionicons color="#1D343B" name="arrow-back" size={23} />
      </Pressable>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 50,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  copy: { alignItems: 'center', flex: 1, paddingHorizontal: 8 },
  title: { color: '#172A31', fontSize: 18, fontWeight: '800' },
  subtitle: { color: '#75858A', fontSize: 11, marginTop: 3 },
  spacer: { width: 40 },
});
