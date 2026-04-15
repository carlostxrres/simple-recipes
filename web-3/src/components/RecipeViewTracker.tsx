"use client"

import { useEffect } from "react"
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed"

interface RecipeViewTrackerProps {
  slug: string
  name: string
}

/** Renders nothing — tracks a recipe view in localStorage on mount. */
export default function RecipeViewTracker({ slug, name }: RecipeViewTrackerProps) {
  const { track } = useRecentlyViewed()

  useEffect(() => {
    track(slug, name)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  return null
}
