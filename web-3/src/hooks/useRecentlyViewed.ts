"use client"

import { useState, useEffect, useCallback } from "react"

const STORAGE_KEY = "simple-eats-recent"
const MAX_ITEMS = 12

export interface RecentEntry {
  slug: string
  name: string
  viewedAt: number
}

function readStorage(): RecentEntry[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as RecentEntry[]) : []
  } catch {
    return []
  }
}

function writeStorage(entries: RecentEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // storage full or unavailable
  }
}

export function useRecentlyViewed() {
  const [recent, setRecent] = useState<RecentEntry[]>([])

  useEffect(() => {
    setRecent(readStorage())
  }, [])

  const track = useCallback((slug: string, name: string) => {
    setRecent((prev) => {
      // Remove existing entry for this slug, prepend fresh entry, cap at MAX_ITEMS
      const filtered = prev.filter((e) => e.slug !== slug)
      const next = [{ slug, name, viewedAt: Date.now() }, ...filtered].slice(0, MAX_ITEMS)
      writeStorage(next)
      return next
    })
  }, [])

  return { recent, track }
}
