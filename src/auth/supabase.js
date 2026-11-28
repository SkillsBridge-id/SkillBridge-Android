import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const CHUNK_SIZE = 1800;

/**
 * Chunked SecureStore adapter so Supabase sessions never hit Android's 2048-byte
 * SecureStore value limit.
 */
const secureStorage = {
  /** @param {string} key */
  async getItem(key) {
    if (Platform.OS === 'web') {
      return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    }

    const chunkCountRaw = await SecureStore.getItemAsync(`${key}__chunks`);
    if (!chunkCountRaw) {
      return SecureStore.getItemAsync(key);
    }

    const chunkCount = Number(chunkCountRaw);
    if (!Number.isInteger(chunkCount) || chunkCount <= 0) {
      return null;
    }

    const parts = await Promise.all(
      Array.from({ length: chunkCount }, (_, index) =>
        SecureStore.getItemAsync(`${key}__chunk_${index}`),
      ),
    );

    if (parts.some((part) => part === null)) {
      return null;
    }

    return parts.join('');
  },

  /** @param {string} key @param {string} value */
  async setItem(key, value) {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      }
      return;
    }

    await secureStorage.removeItem(key);

    if (value.length <= CHUNK_SIZE) {
      await SecureStore.setItemAsync(key, value);
      return;
    }

    const chunks = [];
    for (let offset = 0; offset < value.length; offset += CHUNK_SIZE) {
      chunks.push(value.slice(offset, offset + CHUNK_SIZE));
    }

    await Promise.all(
      chunks.map((chunk, index) =>
        SecureStore.setItemAsync(`${key}__chunk_${index}`, chunk),
      ),
    );
    await SecureStore.setItemAsync(`${key}__chunks`, String(chunks.length));
  },

  /** @param {string} key */
  async removeItem(key) {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
      return;
    }

    const chunkCountRaw = await SecureStore.getItemAsync(`${key}__chunks`);
    await SecureStore.deleteItemAsync(key);

    if (chunkCountRaw) {
      const chunkCount = Number(chunkCountRaw);
      await SecureStore.deleteItemAsync(`${key}__chunks`);
      if (Number.isInteger(chunkCount) && chunkCount > 0) {
        await Promise.all(
          Array.from({ length: chunkCount }, (_, index) =>
            SecureStore.deleteItemAsync(`${key}__chunk_${index}`),
          ),
        );
      }
    }
  },
};

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: false,
        persistSession: true,
        storage: secureStorage,
      },
    })
  : null;
