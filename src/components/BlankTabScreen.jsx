import { SafeAreaView, StyleSheet, Text } from 'react-native';

/**
 * @param {{ label: string }} props
 */
export default function BlankTabScreen({ label }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>{label}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F7F8F4',
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    color: '#12212C',
    fontFamily: 'sans-serif',
    fontSize: 24,
    fontWeight: '700',
  },
});
