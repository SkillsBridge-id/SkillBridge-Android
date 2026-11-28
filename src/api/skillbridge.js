import { apiRequest } from './client';

/** @typedef {import('./schema/generated').components['schemas']} Schemas */

export const skillBridgeApi = {
  /** @param {AbortSignal} [signal] @returns {Promise<Schemas['MissionSummary'][]>} */
  getMissions: (signal) =>
    apiRequest('/api/v1/missions', { signal }),

  /** @param {string} missionId @param {AbortSignal} [signal] */
  getMission: (missionId, signal) =>
    apiRequest(`/api/v1/missions/${encodeURIComponent(missionId)}`, { signal }),

  /** @param {AbortSignal} [signal] */
  getProgressionPolicy: (signal) =>
    apiRequest('/api/v1/progression/policy', { signal }),

  /** @param {AbortSignal} [signal] @returns {Promise<Schemas['Profile']>} */
  getProfile: (signal) => apiRequest('/api/v1/me', { auth: true, signal }),

  /** @param {Schemas['UpdateProfileRequest']} profile @param {AbortSignal} [signal] */
  updateProfile: (profile, signal) =>
    apiRequest('/api/v1/me', {
      auth: true,
      body: profile,
      method: 'PATCH',
      signal,
    }),

  /** @param {AbortSignal} [signal] */
  getCareerGoals: (signal) =>
    apiRequest('/api/v1/me/career-goals', { auth: true, signal }),

  /** @param {Schemas['ReplaceCareerGoalsRequest']} goals @param {AbortSignal} [signal] */
  replaceCareerGoals: (goals, signal) =>
    apiRequest('/api/v1/me/career-goals', {
      auth: true,
      body: goals,
      method: 'PUT',
      signal,
    }),

  /** @param {string} goalId @param {AbortSignal} [signal] */
  deleteCareerGoal: (goalId, signal) =>
    apiRequest(`/api/v1/me/career-goals/${encodeURIComponent(goalId)}`, {
      auth: true,
      method: 'DELETE',
      signal,
    }),

  /** @param {AbortSignal} [signal] */
  getLearningPreferences: (signal) =>
    apiRequest('/api/v1/me/learning-preferences', { auth: true, signal }),

  /** @param {Schemas['LearningPreferences']} preferences @param {AbortSignal} [signal] */
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

  /** @param {AbortSignal} [signal] */
  getActivity: (signal) =>
    apiRequest('/api/v1/me/activity', { auth: true, signal }),

  /** @param {AbortSignal} [signal] @returns {Promise<Schemas['AchievementsResponse']['data']>} */
  getAchievements: (signal) =>
    apiRequest('/api/v1/me/achievements', { auth: true, signal }),

  /** @param {AbortSignal} [signal] */
  getDashboard: (signal) =>
    apiRequest('/api/v1/me/dashboard', { auth: true, signal }),

  /** @param {AbortSignal} [signal] */
  getRecommendations: (signal) =>
    apiRequest('/api/v1/me/recommendations', { auth: true, signal }),

  /** @param {string} missionId @param {Schemas['CreateSubmissionRequest']} submission @param {AbortSignal} [signal] */
  createSubmission: (missionId, submission, signal) =>
    apiRequest(`/api/v1/missions/${encodeURIComponent(missionId)}/submissions`, {
      auth: true,
      body: submission,
      method: 'POST',
      signal,
    }),

  /** @param {AbortSignal} [signal] */
  getSubmissions: (signal) =>
    apiRequest('/api/v1/me/submissions', { auth: true, signal }),

  /** @param {string} submissionId @param {AbortSignal} [signal] */
  getSubmission: (submissionId, signal) =>
    apiRequest(`/api/v1/submissions/${encodeURIComponent(submissionId)}`, {
      auth: true,
      signal,
    }),

  /** @param {string} submissionId @param {AbortSignal} [signal] */
  requestAssessment: (submissionId, signal) =>
    apiRequest(`/api/v1/submissions/${encodeURIComponent(submissionId)}/assessment`, {
      auth: true,
      method: 'POST',
      signal,
    }),

  /** @param {string} submissionId @param {AbortSignal} [signal] */
  getAssessment: (submissionId, signal) =>
    apiRequest(`/api/v1/submissions/${encodeURIComponent(submissionId)}/assessment`, {
      auth: true,
      signal,
    }),
};
