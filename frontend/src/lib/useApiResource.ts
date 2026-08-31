import { useEffect, useState } from 'react'

interface Settled<T> {
  key: string
  data: T | null
  error: string | null
}

/**
 * Loads a single API resource and re-runs whenever `key` changes.
 *
 * `loading` is derived from whether the settled result belongs to the current
 * key, so nothing is set synchronously inside the effect, and results from a
 * superseded key are ignored rather than flashing on screen.
 */
export function useApiResource<T>(key: string, fetcher: () => Promise<T>) {
  const [settled, setSettled] = useState<Settled<T>>({ key: '', data: null, error: null })

  useEffect(() => {
    let cancelled = false

    fetcher()
      .then((data) => {
        if (!cancelled) setSettled({ key, data, error: null })
      })
      .catch((error: Error) => {
        if (!cancelled) setSettled({ key, data: null, error: error.message })
      })

    return () => {
      cancelled = true
    }
    // `fetcher` is intentionally excluded: `key` identifies the request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const isCurrent = settled.key === key

  return {
    data: isCurrent ? settled.data : null,
    error: isCurrent ? settled.error : null,
    loading: !isCurrent,
  }
}
