import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/AuthContext';
import ScreenHeader from '../components/ScreenHeader';

export default function SignInScreen() {
  const { authError, clearAuthError, isAuthenticated, isConfigured, signIn, signOut, signUp, user } =
    useAuth();
  const [mode, setMode] = useState(/** @type {'signIn' | 'signUp'} */ ('signIn'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(/** @type {string | null} */ (null));
  const [errorText, setErrorText] = useState(/** @type {string | null} */ (null));

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorText('Enter your email and password.');
      return;
    }

    setSubmitting(true);
    setErrorText(null);
    setFeedback(null);
    clearAuthError();

    try {
      if (mode === 'signIn') {
        await signIn(trimmedEmail, password);
        router.replace('/home');
      } else {
        const result = await signUp(trimmedEmail, password);
        if (result.needsEmailConfirmation) {
          setFeedback('Check your email to confirm your account, then sign in.');
          setMode('signIn');
        } else {
          router.replace('/home');
        }
      }
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ScreenHeader
            subtitle="Sign in with your Supabase student account"
            title={mode === 'signIn' ? 'Sign In' : 'Create Account'}
          />

          {!isConfigured ? (
            <View style={styles.noticeCard}>
              <Ionicons color="#C97A10" name="warning-outline" size={22} />
              <View style={styles.noticeBody}>
                <Text style={styles.noticeTitle}>Supabase Auth not configured</Text>
                <Text style={styles.noticeText}>
                  Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env
                  file to enable student sign-in. You can still browse public missions on Explore.
                </Text>
              </View>
            </View>
          ) : null}

          {isAuthenticated ? (
            <View style={styles.signedInCard}>
              <Text style={styles.signedInTitle}>Signed in</Text>
              <Text style={styles.signedInEmail}>{user?.email ?? user?.id}</Text>
              <View style={styles.signedInActions}>
                <Pressable onPress={() => router.replace('/home')} style={styles.primaryButton}>
                  <Text style={styles.primaryLabel}>Continue to Home</Text>
                </Pressable>
                <Pressable onPress={signOut} style={styles.secondaryButton}>
                  <Text style={styles.secondaryLabel}>Sign Out</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.formCard}>
              {authError || errorText ? (
                <View style={styles.errorBox}>
                  <Ionicons color="#C0392B" name="alert-circle-outline" size={18} />
                  <Text style={styles.errorText}>{errorText ?? authError}</Text>
                </View>
              ) : null}

              {feedback ? (
                <View style={styles.successBox}>
                  <Ionicons color="#138E62" name="checkmark-circle-outline" size={18} />
                  <Text style={styles.successText}>{feedback}</Text>
                </View>
              ) : null}

              <Text style={styles.label}>Email</Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="student@example.com"
                placeholderTextColor="#91A09F"
                style={styles.input}
                value={email}
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                autoCapitalize="none"
                autoComplete={mode === 'signIn' ? 'password' : 'new-password'}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor="#91A09F"
                secureTextEntry
                style={styles.input}
                value={password}
              />

              <Pressable
                disabled={submitting || !isConfigured}
                onPress={handleSubmit}
                style={[
                  styles.primaryButton,
                  (submitting || !isConfigured) && styles.buttonDisabled,
                ]}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryLabel}>
                    {mode === 'signIn' ? 'Sign In' : 'Create Account'}
                  </Text>
                )}
              </Pressable>

              <Pressable
                onPress={() => {
                  setMode((current) => (current === 'signIn' ? 'signUp' : 'signIn'));
                  setErrorText(null);
                  setFeedback(null);
                }}
                style={styles.switchButton}
              >
                <Text style={styles.switchText}>
                  {mode === 'signIn'
                    ? 'Need an account? Create one'
                    : 'Already have an account? Sign in'}
                </Text>
              </Pressable>
            </View>
          )}

          <Pressable onPress={() => router.replace('/explore')} style={styles.browseLink}>
            <Text style={styles.browseText}>Browse public missions without signing in</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F7FAF8', flex: 1 },
  flex: { flex: 1 },
  content: { padding: 20, paddingBottom: 32 },
  noticeCard: {
    backgroundColor: '#FFF7E8',
    borderColor: '#F3DFB8',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    padding: 14,
  },
  noticeBody: { flex: 1 },
  noticeTitle: { color: '#7D4E07', fontSize: 13, fontWeight: '800' },
  noticeText: { color: '#7D5C2B', fontSize: 12, lineHeight: 17, marginTop: 4 },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5EEEC',
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 22,
    padding: 18,
  },
  signedInCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5EEEC',
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 22,
    padding: 20,
  },
  signedInTitle: { color: '#173038', fontSize: 18, fontWeight: '800' },
  signedInEmail: { color: '#5F7177', fontSize: 14, marginTop: 4 },
  signedInActions: { gap: 10, marginTop: 18 },
  label: { color: '#263A41', fontSize: 13, fontWeight: '700', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#F7FAF8',
    borderColor: '#DCE7E4',
    borderRadius: 14,
    borderWidth: 1,
    color: '#173038',
    fontSize: 15,
    height: 48,
    paddingHorizontal: 14,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#16B276',
    borderRadius: 16,
    height: 48,
    justifyContent: 'center',
    marginTop: 18,
  },
  buttonDisabled: { opacity: 0.5 },
  primaryLabel: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#EFF5F3',
    borderRadius: 16,
    height: 46,
    justifyContent: 'center',
  },
  secondaryLabel: { color: '#173038', fontSize: 14, fontWeight: '700' },
  switchButton: { alignItems: 'center', marginTop: 16, paddingVertical: 6 },
  switchText: { color: '#16A873', fontSize: 13, fontWeight: '700' },
  errorBox: {
    alignItems: 'center',
    backgroundColor: '#FDEDEC',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    padding: 10,
  },
  errorText: { color: '#922B21', flex: 1, fontSize: 12, lineHeight: 17 },
  successBox: {
    alignItems: 'center',
    backgroundColor: '#E7F7F0',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    padding: 10,
  },
  successText: { color: '#138E62', flex: 1, fontSize: 12, lineHeight: 17 },
  browseLink: { alignItems: 'center', marginTop: 22 },
  browseText: { color: '#5F7177', fontSize: 13, fontWeight: '600' },
});
