import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ApiError } from '../api/client';

/**
 * Displays auth prompts or authoritative API error states (401, 403, 503, network).
 *
 * @param {{
 *   error?: unknown,
 *   isAuthenticated?: boolean,
 *   onRetry?: () => void,
 *   signInMessage?: string,
 * }} props
 */
export default function ApiStateBanner({
  error,
  isAuthenticated = true,
  onRetry,
  signInMessage = 'Sign in to load your SkillBridge progress and submissions.',
}) {
  if (!isAuthenticated) {
    return (
      <View style={styles.card}>
        <Ionicons color="#16A873" name="person-circle-outline" size={22} />
        <View style={styles.body}>
          <Text style={styles.title}>Sign in required</Text>
          <Text style={styles.message}>{signInMessage}</Text>
        </View>
        <Pressable onPress={() => router.push('/sign-in')} style={styles.button}>
          <Text style={styles.buttonText}>Sign in</Text>
        </Pressable>
      </View>
    );
  }

  if (!error) {
    return null;
  }

  const isApiError = error instanceof ApiError;
  const status = isApiError ? error.status : null;
  const code = isApiError ? error.code : null;
  const requestId = isApiError ? error.requestId : null;
  const isForbidden = status === 403 || code === 'ROLE_NOT_ALLOWED';
  const isUnauthorized = status === 401 || code === 'UNAUTHENTICATED' || code === 'INVALID_TOKEN';

  const message = isForbidden
    ? 'Your account role is not enabled for student access. Contact support if this persists.'
    : error instanceof Error
      ? error.message
      : 'Unable to reach the SkillBridge API.';

  return (
    <View style={[styles.card, isForbidden && styles.cardWarning]}>
      <Ionicons
        color={isForbidden ? '#C97A10' : '#64767B'}
        name={isForbidden ? 'shield-outline' : 'cloud-offline-outline'}
        size={22}
      />
      <View style={styles.body}>
        <Text style={styles.title}>
          {isForbidden
            ? 'Account access restricted'
            : isUnauthorized
              ? 'Session expired'
              : 'Connection issue'}
        </Text>
        <Text style={styles.message}>{message}</Text>
        {requestId ? <Text style={styles.requestId}>Request ID: {requestId}</Text> : null}
      </View>
      {isUnauthorized ? (
        <Pressable onPress={() => router.push('/sign-in')} style={styles.button}>
          <Text style={styles.buttonText}>Sign in</Text>
        </Pressable>
      ) : !isForbidden && onRetry ? (
        <Pressable onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#EEF5F3',
    borderColor: '#DCE8E4',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    padding: 14,
  },
  cardWarning: {
    backgroundColor: '#FFF7E8',
    borderColor: '#F3DFB8',
  },
  body: {
    flex: 1,
  },
  title: {
    color: '#173038',
    fontSize: 13,
    fontWeight: '800',
  },
  message: {
    color: '#5C6E74',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  requestId: {
    color: '#7A8A90',
    fontSize: 10,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#16B276',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  retryButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CFE0DB',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  retryText: {
    color: '#173038',
    fontSize: 12,
    fontWeight: '700',
  },
});
