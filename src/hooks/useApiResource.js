import { useCallback, useEffect, useState } from 'react';

/**
 * @template T
 * @param {(signal: AbortSignal) => Promise<T>} loader
 * @param {{ enabled?: boolean }} [options]
 */
export function useApiResource(loader, options = {}) {
  const { enabled = true } = options;
  const [state, setState] = useState(
    /** @type {{ data: T | null, error: unknown, loading: boolean, revision: number }} */ ({
      data: null,
      error: null,
      loading: enabled,
      revision: 0,
    }),
  );

  const refresh = useCallback(() => {
    setState((current) => ({
      ...current,
      error: null,
      loading: enabled,
      revision: current.revision + 1,
    }));
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const controller = new AbortController();

    loader(controller.signal)
      .then((data) => {
        setState((current) => ({ ...current, data, error: null, loading: false }));
      })
      .catch((error) => {
        if (!(error instanceof Error && error.name === 'AbortError')) {
          setState((current) => ({ ...current, error, loading: false }));
        }
      });

    return () => controller.abort();
  }, [enabled, loader, state.revision]);

  return {
    data: enabled ? state.data : null,
    error: enabled ? state.error : null,
    loading: enabled ? state.loading : false,
    refresh,
  };
}
