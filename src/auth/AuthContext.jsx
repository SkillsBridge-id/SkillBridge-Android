import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { configureApiAuth } from '../api/client';
import { isSupabaseConfigured, supabase } from './supabase';

/**
 * @typedef {import('@supabase/supabase-js').Session} Session
 * @typedef {import('@supabase/supabase-js').User} User
 *
 * @typedef {{
 *   isConfigured: boolean,
 *   isLoading: boolean,
 *   isAuthenticated: boolean,
 *   session: Session | null,
 *   user: User | null,
 *   authError: string | null,
 *   signIn: (email: string, password: string) => Promise<void>,
 *   signUp: (email: string, password: string) => Promise<{ needsEmailConfirmation: boolean }>,
 *   signOut: () => Promise<void>,
 *   clearAuthError: () => void,
 * }} AuthContextValue
 */

const AuthContext = createContext(/** @type {AuthContextValue | null} */ (null));

/** @param {{ children: React.ReactNode }} props */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(/** @type {Session | null} */ (null));
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [authError, setAuthError] = useState(/** @type {string | null} */ (null));

  useEffect(() => {
    if (!supabase) {
      return undefined;
    }

    let active = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setAuthError(error.message);
        }
        setSession(data.session ?? null);
        setIsLoading(false);
      })
      .catch((error) => {
        if (!active) return;
        setAuthError(error instanceof Error ? error.message : 'Failed to load session.');
        setIsLoading(false);
      });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      if (nextSession) {
        setAuthError(null);
      }
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    configureApiAuth({
      getAccessToken: async () => {
        if (!supabase) return null;
        const { data } = await supabase.auth.getSession();
        return data.session?.access_token ?? null;
      },
      refreshAccessToken: async () => {
        if (!supabase) return null;
        const { data, error } = await supabase.auth.refreshSession();
        if (error) {
          return null;
        }
        return data.session?.access_token ?? null;
      },
      onUnauthorized: () => {
        setAuthError('Your session expired. Please sign in again.');
        setSession(null);
        supabase?.auth.signOut({ scope: 'local' }).catch(() => undefined);
      },
    });
  }, []);

  const signIn = useCallback(
    /** @param {string} email @param {string} password */
    async (email, password) => {
      if (!supabase) {
        throw new Error(
          'Supabase Auth is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
        );
      }
      setAuthError(null);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw error;
      }
      setSession(data.session ?? null);
    },
    [],
  );

  const signUp = useCallback(
    /** @param {string} email @param {string} password */
    async (email, password) => {
      if (!supabase) {
        throw new Error(
          'Supabase Auth is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
        );
      }
      setAuthError(null);
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        throw error;
      }
      setSession(data.session ?? null);
      return { needsEmailConfirmation: !data.session };
    },
    [],
  );

  const signOut = useCallback(async () => {
    setAuthError(null);
    setSession(null);
    if (supabase) {
      await supabase.auth.signOut();
    }
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const value = useMemo(
    () => ({
      authError,
      clearAuthError,
      isAuthenticated: Boolean(session?.access_token),
      isConfigured: isSupabaseConfigured,
      isLoading,
      session,
      signIn,
      signOut,
      signUp,
      user: session?.user ?? null,
    }),
    [authError, clearAuthError, isLoading, session, signIn, signOut, signUp],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
