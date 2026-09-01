import { useCallback, useEffect, useState } from 'react'

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
 *
 * `reload()` re-runs the same key — for after a mutation. `mutate()` replaces the
 * data in place, so a screen that already knows the new value (a cancelled booking,
 * say) can show it without a second round trip.
 */
export function useApiResource<T>(key: string, fetcher: () => Promise<T>) {
  const [nonce, setNonce] = useState(0)
  const [settled, setSettled] = useState<Settled<T>>({ key: '', data: null, error: null })

  // The nonce is folded into the identity so a reload is treated as a new request.
  const requestKey = `${key}#${nonce}`

  useEffect(() => {
    let cancelled = false

    fetcher()
      .then((data) => {
        if (!cancelled) setSettled({ key: requestKey, data, error: null })
      })
      .catch((error: Error) => {
        if (!cancelled) setSettled({ key: requestKey, data: null, error: error.message })
      })

    return () => {
      cancelled = true
    }
    // `fetcher` is intentionally excluded: `key` identifies the request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey])

  const isCurrent = settled.key === requestKey

  const reload = useCallback(() => setNonce((current) => current + 1), [])

  const mutate = useCallback(
    (next: T) => setSettled((current) => ({ ...current, data: next, error: null })),
    [],
  )

  return {
    data: isCurrent ? settled.data : null,
    error: isCurrent ? settled.error : null,
    loading: !isCurrent,
    reload,
    mutate,
  }
}
