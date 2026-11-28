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
import { ApiError } from '../api/client';
import { skillBridgeApi } from '../api/skillbridge';
import { useAuth } from '../auth/AuthContext';
import ApiStateBanner from '../components/ApiStateBanner';
import ScreenHeader from '../components/ScreenHeader';
import { useApiResource } from '../hooks/useApiResource';

/** @param {unknown} error */
function formatError(error) {
  if (error instanceof ApiError && error.requestId) {
    return `${error.message} (Request ID: ${error.requestId})`;
  }
  return error instanceof Error ? error.message : 'Request failed.';
}

export default function SettingsScreen() {
  const { isAuthenticated, signOut, user } = useAuth();

  const { data: policy } = useApiResource(skillBridgeApi.getProgressionPolicy);
  const {
    data: profile,
    error: profileError,
    refresh: refreshProfile,
  } = useApiResource(skillBridgeApi.getProfile, { enabled: isAuthenticated });
  const {
    data: careerGoals,
    error: goalsError,
    refresh: refreshGoals,
  } = useApiResource(skillBridgeApi.getCareerGoals, { enabled: isAuthenticated });
  const {
    data: preferences,
    error: prefsError,
    refresh: refreshPrefs,
  } = useApiResource(skillBridgeApi.getLearningPreferences, { enabled: isAuthenticated });

  const [displayNameDraft, setDisplayNameDraft] = useState(/** @type {string | null} */ (null));
  const [avatarUrlDraft, setAvatarUrlDraft] = useState(/** @type {string | null} */ (null));
  const [bioDraft, setBioDraft] = useState(/** @type {string | null} */ (null));
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState(/** @type {string | null} */ (null));

  const [goalsDraftOverride, setGoalsDraftOverride] = useState(
    /** @type {Array<{ id?: string, title: string, description: string, isPrimary: boolean }> | null} */ (
      null
    ),
  );
  const [goalsSaving, setGoalsSaving] = useState(false);
  const [goalsFeedback, setGoalsFeedback] = useState(/** @type {string | null} */ (null));

  const [dailyXpGoalDraft, setDailyXpGoalDraft] = useState(/** @type {string | null} */ (null));
  const [timezoneDraft, setTimezoneDraft] = useState(/** @type {string | null} */ (null));
  const [prefsSaving, setPrefsSaving] = useState(false);
  const [prefsFeedback, setPrefsFeedback] = useState(/** @type {string | null} */ (null));

  const displayName = displayNameDraft ?? profile?.displayName ?? '';
  const avatarUrl = avatarUrlDraft ?? profile?.avatarUrl ?? '';
  const bio = bioDraft ?? profile?.bio ?? '';

  const goalsDraft =
    goalsDraftOverride ??
    (careerGoals ?? []).map((goal) => ({
      description: goal.description ?? '',
      id: goal.id,
      isPrimary: goal.isPrimary,
      title: goal.title,
    }));

  const dailyXpGoal =
    dailyXpGoalDraft ??
    String(preferences?.dailyXpGoal ?? policy?.defaultDailyXpGoal ?? 50);
  const timezone = timezoneDraft ?? preferences?.timezone ?? policy?.defaultTimezone ?? 'UTC';

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setProfileFeedback(null);
    try {
      await skillBridgeApi.updateProfile({
        avatarUrl: avatarUrl.trim() || null,
        bio: bio.trim() || null,
        displayName: displayName.trim() || undefined,
      });
      setDisplayNameDraft(null);
      setAvatarUrlDraft(null);
      setBioDraft(null);
      refreshProfile();
      setProfileFeedback('Profile saved.');
    } catch (error) {
      setProfileFeedback(formatError(error));
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAddGoal = () => {
    if (goalsDraft.length >= 5) return;
    setGoalsDraftOverride([
      ...goalsDraft,
      { description: '', isPrimary: goalsDraft.length === 0, title: '' },
    ]);
  };

  /** @param {number} targetIndex */
  const handleSetPrimaryGoal = (targetIndex) => {
    setGoalsDraftOverride(
      goalsDraft.map((goal, index) => ({ ...goal, isPrimary: index === targetIndex })),
    );
  };

  /** @param {number} index */
  const handleDeleteGoal = async (index) => {
    const target = goalsDraft[index];
    if (!target) return;
    if (target.id && !target.isPrimary) {
      try {
        await skillBridgeApi.deleteCareerGoal(target.id);
        setGoalsDraftOverride(null);
        refreshGoals();
        setGoalsFeedback('Goal deleted.');
        return;
      } catch (error) {
        setGoalsFeedback(formatError(error));
        return;
      }
    }
    setGoalsDraftOverride(goalsDraft.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleSaveGoals = async () => {
    const cleaned = goalsDraft
      .map((goal) => ({
        description: goal.description.trim() || undefined,
        isPrimary: goal.isPrimary,
        title: goal.title.trim(),
      }))
      .filter((goal) => goal.title.length > 0);

    if (cleaned.length < 1 || cleaned.length > 5) {
      setGoalsFeedback('Provide between 1 and 5 career goals.');
      return;
    }
    if (cleaned.filter((goal) => goal.isPrimary).length !== 1) {
      setGoalsFeedback('Select exactly one primary career goal.');
      return;
    }

    setGoalsSaving(true);
    setGoalsFeedback(null);
    try {
      await skillBridgeApi.replaceCareerGoals(cleaned);
      setGoalsDraftOverride(null);
      refreshGoals();
      setGoalsFeedback('Career goals updated.');
    } catch (error) {
      setGoalsFeedback(formatError(error));
    } finally {
      setGoalsSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    const parsedGoal = Number(dailyXpGoal);
    if (!Number.isFinite(parsedGoal) || parsedGoal <= 0) {
      setPrefsFeedback('Enter a valid daily XP goal.');
      return;
    }

    setPrefsSaving(true);
    setPrefsFeedback(null);
    try {
      await skillBridgeApi.updateLearningPreferences({
        dailyXpGoal: Math.round(parsedGoal),
        timezone: timezone.trim() || policy?.defaultTimezone || 'UTC',
      });
      setDailyXpGoalDraft(null);
      setTimezoneDraft(null);
      refreshPrefs();
      setPrefsFeedback('Learning preferences saved.');
    } catch (error) {
      setPrefsFeedback(formatError(error));
    } finally {
      setPrefsSaving(false);
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
          <ScreenHeader subtitle="Profile, career goals, and learning preferences" title="Settings" />

          <View style={styles.bannerWrap}>
            <ApiStateBanner
              error={profileError ?? goalsError ?? prefsError}
              isAuthenticated={isAuthenticated}
              onRetry={() => {
                refreshProfile();
                refreshGoals();
                refreshPrefs();
              }}
              signInMessage="Sign in to manage your SkillBridge profile and preferences."
            />
          </View>

          {isAuthenticated ? (
            <>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Profile</Text>
                <Text style={styles.label}>Display Name</Text>
                <TextInput
                  onChangeText={setDisplayNameDraft}
                  placeholder="Your name"
                  placeholderTextColor="#91A09F"
                  style={styles.input}
                  value={displayName}
                />
                <Text style={styles.label}>Avatar URL</Text>
                <TextInput
                  autoCapitalize="none"
                  onChangeText={setAvatarUrlDraft}
                  placeholder="https://..."
                  placeholderTextColor="#91A09F"
                  style={styles.input}
                  value={avatarUrl}
                />
                <Text style={styles.label}>Bio</Text>
                <TextInput
                  multiline
                  onChangeText={setBioDraft}
                  placeholder="Tell us what you are learning"
                  placeholderTextColor="#91A09F"
                  style={[styles.input, styles.multilineInput]}
                  value={bio}
                />
                {profileFeedback ? <Text style={styles.feedbackText}>{profileFeedback}</Text> : null}
                <Pressable
                  disabled={profileSaving}
                  onPress={handleSaveProfile}
                  style={styles.primaryButton}
                >
                  {profileSaving ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryLabel}>Save Profile</Text>
                  )}
                </Pressable>
              </View>

              <View style={styles.card}>
                <View style={styles.rowBetween}>
                  <Text style={styles.cardTitle}>Career Goals (1–5)</Text>
                  {goalsDraft.length < 5 ? (
                    <Pressable onPress={handleAddGoal}>
                      <Text style={styles.addLink}>+ Add goal</Text>
                    </Pressable>
                  ) : null}
                </View>

                {goalsDraft.map((goal, index) => (
                  <View key={goal.id ?? `draft-${index}`} style={styles.goalItem}>
                    <View style={styles.goalHeader}>
                      <Pressable
                        onPress={() => handleSetPrimaryGoal(index)}
                        style={styles.primaryToggle}
                      >
                        <Ionicons
                          color={goal.isPrimary ? '#16B276' : '#8C9B9E'}
                          name={goal.isPrimary ? 'radio-button-on' : 'radio-button-off'}
                          size={18}
                        />
                        <Text style={styles.primaryToggleText}>
                          {goal.isPrimary ? 'Primary goal' : 'Set as primary'}
                        </Text>
                      </Pressable>
                      <Pressable onPress={() => handleDeleteGoal(index)}>
                        <Ionicons color="#C0392B" name="trash-outline" size={18} />
                      </Pressable>
                    </View>
                    <TextInput
                      onChangeText={(text) =>
                        setGoalsDraftOverride(
                          goalsDraft.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, title: text } : item,
                          ),
                        )
                      }
                      placeholder="Goal title (e.g. Data Analyst)"
                      placeholderTextColor="#91A09F"
                      style={styles.input}
                      value={goal.title}
                    />
                    <TextInput
                      onChangeText={(text) =>
                        setGoalsDraftOverride(
                          goalsDraft.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, description: text } : item,
                          ),
                        )
                      }
                      placeholder="Optional description"
                      placeholderTextColor="#91A09F"
                      style={styles.input}
                      value={goal.description}
                    />
                  </View>
                ))}

                {goalsFeedback ? <Text style={styles.feedbackText}>{goalsFeedback}</Text> : null}
                <Pressable
                  disabled={goalsSaving}
                  onPress={handleSaveGoals}
                  style={styles.primaryButton}
                >
                  {goalsSaving ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryLabel}>Save Career Goals</Text>
                  )}
                </Pressable>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Learning Preferences</Text>
                <Text style={styles.label}>
                  Daily XP Goal
                  {policy
                    ? ` (${policy.minimumDailyXpGoal}–${policy.maximumDailyXpGoal})`
                    : ''}
                </Text>
                <TextInput
                  keyboardType="number-pad"
                  onChangeText={setDailyXpGoalDraft}
                  placeholder="50"
                  placeholderTextColor="#91A09F"
                  style={styles.input}
                  value={dailyXpGoal}
                />
                <Text style={styles.label}>Timezone (IANA)</Text>
                <TextInput
                  autoCapitalize="none"
                  onChangeText={setTimezoneDraft}
                  placeholder="Asia/Jakarta"
                  placeholderTextColor="#91A09F"
                  style={styles.input}
                  value={timezone}
                />
                {prefsFeedback ? <Text style={styles.feedbackText}>{prefsFeedback}</Text> : null}
                <Pressable
                  disabled={prefsSaving}
                  onPress={handleSavePreferences}
                  style={styles.primaryButton}
                >
                  {prefsSaving ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryLabel}>Save Preferences</Text>
                  )}
                </Pressable>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Account</Text>
                <Text style={styles.accountEmail}>{user?.email ?? user?.id}</Text>
                <Pressable
                  onPress={async () => {
                    await signOut();
                    router.replace('/sign-in');
                  }}
                  style={styles.signOutButton}
                >
                  <Text style={styles.signOutLabel}>Sign Out</Text>
                </Pressable>
              </View>
            </>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F7FAF8', flex: 1 },
  flex: { flex: 1 },
  content: { padding: 20, paddingBottom: 36 },
  bannerWrap: { marginTop: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E6EEEC',
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 14,
    padding: 16,
  },
  cardTitle: { color: '#173038', fontSize: 16, fontWeight: '800', marginBottom: 8 },
  rowBetween: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  addLink: { color: '#16A873', fontSize: 13, fontWeight: '700' },
  label: { color: '#394D54', fontSize: 12, fontWeight: '700', marginBottom: 5, marginTop: 10 },
  input: {
    backgroundColor: '#F7FAF8',
    borderColor: '#DCE7E4',
    borderRadius: 12,
    borderWidth: 1,
    color: '#173038',
    fontSize: 14,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 6,
  },
  multilineInput: { minHeight: 80, textAlignVertical: 'top' },
  goalItem: {
    backgroundColor: '#F9FBFA',
    borderColor: '#E5EEEC',
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 10,
    padding: 12,
  },
  goalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  primaryToggle: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  primaryToggleText: { color: '#263A41', fontSize: 12, fontWeight: '700' },
  feedbackText: { color: '#138E62', fontSize: 12, fontWeight: '600', marginTop: 8 },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#16B276',
    borderRadius: 14,
    height: 44,
    justifyContent: 'center',
    marginTop: 12,
  },
  primaryLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  accountEmail: { color: '#5F7177', fontSize: 13, marginBottom: 12 },
  signOutButton: {
    alignItems: 'center',
    backgroundColor: '#FDEDEC',
    borderRadius: 14,
    height: 44,
    justifyContent: 'center',
  },
  signOutLabel: { color: '#C0392B', fontSize: 14, fontWeight: '800' },
});
