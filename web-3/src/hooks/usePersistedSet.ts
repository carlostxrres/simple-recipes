"use client"

import { useState, useEffect, useCallback } from "react"

function readSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const raw = localStorage.getItem(key)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

function writeSet(key: string, ids: Set<string>) {
  if (ids.size === 0) {
    localStorage.removeItem(key)
  } else {
    localStorage.setItem(key, JSON.stringify([...ids]))
  }
}

/**
 * A Set<string> backed by localStorage. Hydrates after mount to avoid SSR
 * mismatch. Automatically removes the key when the set becomes empty.
 * Optional onWriteError callback fires if localStorage.setItem throws (e.g. quota exceeded).
 */
export function usePersistedSet(storageKey: string, onWriteError?: () => void) {
  const [ids, setIds] = useState<Set<string>>(new Set())
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setIds(readSet(storageKey))
    setHydrated(true)
  }, [storageKey])

  const toggle = useCallback(
    (id: string) => {
      setIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        try {
          writeSet(storageKey, next)
        } catch {
          onWriteError?.()
        }
        return next
      })
    },
    [storageKey, onWriteError],
  )

  const clear = useCallback(() => {
    setIds(new Set())
    try {
      writeSet(storageKey, new Set())
    } catch {
      onWriteError?.()
    }
  }, [storageKey, onWriteError])

  return { ids, toggle, clear, hydrated }
}
