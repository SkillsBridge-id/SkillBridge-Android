import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const answers = [
  'To increase unemployment',
  'To achieve economic stability',
  'To reduce innovation',
  'To lower taxes only',
];

export default function QuizScreen() {
  const [selectedAnswer, setSelectedAnswer] = useState(1);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Pressable accessibilityLabel="Close practice" onPress={() => router.back()}>
            <Ionicons color="#2B4046" name="close" size={25} />
          </Pressable>
          <View style={styles.topTrack}>
            <View style={styles.topFill} />
          </View>
          <Text style={styles.counter}>3 / 10</Text>
        </View>

        <View style={styles.illustration}>
          <Ionicons color="#16B276" name="leaf" size={66} />
          <View style={styles.questionBubble}>
            <Text style={styles.questionMark}>?</Text>
          </View>
        </View>

        <Text style={styles.question}>What is the main goal of economic policy?</Text>

        <View style={styles.answers}>
          {answers.map((answer, index) => {
            const selected = selectedAnswer === index;

            return (
              <Pressable
                key={answer}
                onPress={() => setSelectedAnswer(index)}
                style={[styles.answer, selected && styles.answerSelected]}
              >
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected ? <Ionicons color="#FFFFFF" name="checkmark" size={15} /> : null}
                </View>
                <Text style={[styles.answerText, selected && styles.answerTextSelected]}>
                  {answer}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.checkButton}>
          <Text style={styles.checkLabel}>Check Answer</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F8FBFA', flex: 1 },
  content: { flex: 1, padding: 22 },
  topRow: { alignItems: 'center', flexDirection: 'row' },
  topTrack: {
    backgroundColor: '#E2EFEC',
    borderRadius: 5,
    flex: 1,
    height: 9,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  topFill: { backgroundColor: '#16B276', borderRadius: 5, height: '100%', width: '30%' },
  counter: { color: '#263A41', fontSize: 13, fontWeight: '800' },
  illustration: {
    alignItems: 'center',
    backgroundColor: '#E8F8F2',
    borderRadius: 60,
    height: 120,
    justifyContent: 'center',
    marginTop: 38,
    width: 120,
    alignSelf: 'center',
  },
  questionBubble: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: 4,
    top: 2,
    width: 32,
  },
  questionMark: { color: '#16B276', fontSize: 20, fontWeight: '900' },
  question: {
    color: '#1A3037',
    fontSize: 21,
    fontWeight: '800',
    lineHeight: 28,
    marginHorizontal: 16,
    marginTop: 28,
    textAlign: 'center',
  },
  answers: { gap: 11, marginTop: 28 },
  answer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E1EAE7',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 54,
    paddingHorizontal: 14,
  },
  answerSelected: { backgroundColor: '#E8F8F1', borderColor: '#16B276', borderWidth: 2 },
  radio: {
    alignItems: 'center',
    borderColor: '#C6D3D0',
    borderRadius: 12,
    borderWidth: 1,
    height: 24,
    justifyContent: 'center',
    marginRight: 12,
    width: 24,
  },
  radioSelected: { backgroundColor: '#16B276', borderColor: '#16B276' },
  answerText: { color: '#3C4D53', flex: 1, fontSize: 14 },
  answerTextSelected: { color: '#164537', fontWeight: '700' },
  checkButton: {
    alignItems: 'center',
    backgroundColor: '#16B276',
    borderRadius: 24,
    bottom: 20,
    left: 22,
    paddingVertical: 15,
    position: 'absolute',
    right: 22,
  },
  checkLabel: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
