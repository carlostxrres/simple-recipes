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
  try {
    if (ids.size === 0) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, JSON.stringify([...ids]))
    }
  } catch {
    // storage full or unavailable
  }
}

/**
 * A Set<string> backed by localStorage. Hydrates after mount to avoid SSR
 * mismatch. Automatically removes the key when the set becomes empty.
 */
export function usePersistedSet(storageKey: string) {
  const [ids, setIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    setIds(readSet(storageKey))
  }, [storageKey])

  const toggle = useCallback(
    (id: string) => {
      setIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        writeSet(storageKey, next)
        return next
      })
    },
    [storageKey],
  )

  const clear = useCallback(() => {
    setIds(new Set())
    writeSet(storageKey, new Set())
  }, [storageKey])

  return { ids, toggle, clear }
}
