import { useCallback, useEffect, useState } from 'react';

/**
 * @template T
 * @param {(signal: AbortSignal) => Promise<T>} loader
 */
export function useApiResource(loader) {
  const [state, setState] = useState(
    /** @type {{ data: T | null, error: unknown, loading: boolean, revision: number }} */ ({
    data: null,
    error: null,
    loading: true,
    revision: 0,
    }),
  );

  const refresh = useCallback(() => {
    setState((current) => ({
      ...current,
      error: null,
      loading: true,
      revision: current.revision + 1,
    }));
  }, []);

  useEffect(() => {
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
  }, [loader, state.revision]);

  return {
    data: state.data,
    error: state.error,
    loading: state.loading,
    refresh,
  };
}
