import { apiRawRequest, apiRequest } from './client';

/** @typedef {import('./schema/generated').components['schemas']} Schemas */

export const skillBridgeApi = {
  /** @param {AbortSignal} [signal] @returns {Promise<Schemas['HealthResponse']>} */
  getHealth: (signal) => apiRawRequest('/health', signal),

  /** @param {AbortSignal} [signal] @returns {Promise<Schemas['DatabaseHealthResponse']>} */
  getDatabaseHealth: (signal) => apiRawRequest('/health/database', signal),

  /** @param {AbortSignal} [signal] @returns {Promise<Schemas['MissionSummary'][]>} */
  getMissions: (signal) => apiRequest('/api/v1/missions', { signal }),

  /** @param {string} missionId @param {AbortSignal} [signal] @returns {Promise<Schemas['MissionDetailResponse']['data']>} */
  getMission: (missionId, signal) =>
    apiRequest(`/api/v1/missions/${encodeURIComponent(missionId)}`, { signal }),

  /** @param {AbortSignal} [signal] @returns {Promise<Schemas['ProgressionPolicyResponse']['data']>} */
  getProgressionPolicy: (signal) =>
    apiRequest('/api/v1/progression/policy', { signal }),

  /** @param {AbortSignal} [signal] @returns {Promise<Schemas['Profile']>} */
  getProfile: (signal) => apiRequest('/api/v1/me', { auth: true, signal }),

  /** @param {Schemas['UpdateProfileRequest']} profile @param {AbortSignal} [signal] @returns {Promise<Schemas['Profile']>} */
  updateProfile: (profile, signal) =>
    apiRequest('/api/v1/me', {
      auth: true,
      body: profile,
      method: 'PATCH',
      signal,
    }),

  /** @param {AbortSignal} [signal] @returns {Promise<Schemas['CareerGoalsResponse']['data']>} */
  getCareerGoals: (signal) =>
    apiRequest('/api/v1/me/career-goals', { auth: true, signal }),

  /** @param {Schemas['ReplaceCareerGoalsRequest']} goals @param {AbortSignal} [signal] @returns {Promise<Schemas['CareerGoalsResponse']['data']>} */
  replaceCareerGoals: (goals, signal) =>
    apiRequest('/api/v1/me/career-goals', {
      auth: true,
      body: goals,
      method: 'PUT',
      signal,
    }),

  /** @param {string} goalId @param {AbortSignal} [signal] @returns {Promise<{ id: string }>} */
  deleteCareerGoal: (goalId, signal) =>
    apiRequest(`/api/v1/me/career-goals/${encodeURIComponent(goalId)}`, {
      auth: true,
      method: 'DELETE',
      signal,
    }),

  /** @param {AbortSignal} [signal] @returns {Promise<Schemas['LearningPreferencesResponse']['data']>} */
  getLearningPreferences: (signal) =>
    apiRequest('/api/v1/me/learning-preferences', { auth: true, signal }),

  /** @param {Schemas['LearningPreferences']} preferences @param {AbortSignal} [signal] @returns {Promise<Schemas['LearningPreferencesResponse']['data']>} */
  updateLearningPreferences: (preferences, signal) =>
    apiRequest('/api/v1/me/learning-preferences', {
      auth: true,
      body: preferences,
      method: 'PUT',
      signal,
    }),

  /** @param {AbortSignal} [signal] @returns {Promise<Schemas['LearningProgressResponse']['data']>} */
  getProgress: (signal) =>
    apiRequest('/api/v1/me/progress', { auth: true, signal }),

  /** @param {AbortSignal} [signal] @returns {Promise<Schemas['DailyActivityHistoryResponse']['data']>} */
  getActivity: (signal) =>
    apiRequest('/api/v1/me/activity', { auth: true, signal }),

  /** @param {AbortSignal} [signal] @returns {Promise<Schemas['AchievementsResponse']['data']>} */
  getAchievements: (signal) =>
    apiRequest('/api/v1/me/achievements', { auth: true, signal }),

  /** @param {AbortSignal} [signal] @returns {Promise<Schemas['StudentDashboardResponse']['data']>} */
  getDashboard: (signal) =>
    apiRequest('/api/v1/me/dashboard', { auth: true, signal }),

  /** @param {AbortSignal} [signal] @returns {Promise<Schemas['MissionRecommendationsResponse']['data']>} */
  getRecommendations: (signal) =>
    apiRequest('/api/v1/me/recommendations', { auth: true, signal }),

  /** @param {string} missionId @param {Schemas['CreateSubmissionRequest']} submission @param {AbortSignal} [signal] @returns {Promise<Schemas['Submission']>} */
  createSubmission: (missionId, submission, signal) =>
    apiRequest(`/api/v1/missions/${encodeURIComponent(missionId)}/submissions`, {
      auth: true,
      body: submission,
      method: 'POST',
      signal,
    }),

  /** @param {AbortSignal} [signal] @returns {Promise<Schemas['Submission'][]>} */
  getSubmissions: (signal) =>
    apiRequest('/api/v1/me/submissions', { auth: true, signal }),

  /** @param {string} submissionId @param {AbortSignal} [signal] @returns {Promise<Schemas['SubmissionDetailResponse']['data']>} */
  getSubmission: (submissionId, signal) =>
    apiRequest(`/api/v1/submissions/${encodeURIComponent(submissionId)}`, {
      auth: true,
      signal,
    }),

  /** @param {string} submissionId @param {AbortSignal} [signal] @returns {Promise<Schemas['AssessmentRequestResponse']['data']>} */
  requestAssessment: (submissionId, signal) =>
    apiRequest(`/api/v1/submissions/${encodeURIComponent(submissionId)}/assessment`, {
      auth: true,
      method: 'POST',
      signal,
    }),

  /** @param {string} submissionId @param {AbortSignal} [signal] @returns {Promise<Schemas['AssessmentStatusResponse']['data']>} */
  getAssessment: (submissionId, signal) =>
    apiRequest(`/api/v1/submissions/${encodeURIComponent(submissionId)}/assessment`, {
      auth: true,
      signal,
    }),
};
