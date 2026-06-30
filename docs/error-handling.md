# Error Handling Strategy

This document defines how errors are surfaced to users in Simple Eats. Follow it when adding new features or touching existing error paths.

---

## The Four Tiers

### Tier 1 — Full-Page Error

**When to use:** The page cannot render its primary content at all (server-side data fetch failed, unhandled exception, missing resource).

**Implementation:** Next.js `error.tsx` (error boundary with retry) and `not-found.tsx` (404 page).

These files already exist at the route level:

| File | Covers |
|------|--------|
| `web-3/src/app/error.tsx` | Root-level unhandled errors |
| `web-3/src/app/recipes/error.tsx` | Recipe list fetch failure |
| `web-3/src/app/recipes/[slug]/error.tsx` | Individual recipe fetch failure |
| `web-3/src/app/not-found.tsx` | 404 — any unmatched route |

**Rule:** If the page can partially recover (e.g. by showing empty state), use Tier 3 or Tier 4 instead.

---

### Tier 2 — Toast Notification (Sileo)

**When to use:** A user-initiated action fails or succeeds in a way that has no visible inline feedback.

**Implementation:** [Sileo](https://sileo.aaryan.design/docs) — imported as `import { sileo } from "sileo"`. The `<Toaster position="bottom-right" />` is mounted in `web-3/src/app/layout.tsx`.

#### Available methods

```ts
sileo.error({ title, description })    // Destructive failure — storage write, API error
sileo.warning({ title, description }) // Degraded experience — clipboard unavailable, wake lock denied
sileo.success({ title, description }) // Confirmation when no inline feedback exists
sileo.info({ title, description })    // Neutral information
```

#### Decision rules

1. Did the **user deliberately trigger** this action? → surface it.
2. Does failure leave the user in a **misleading state** (e.g., data appears saved but wasn't)? → surface it.
3. Is there already **inline UI feedback** for success (button state change, icon toggle)? → only add an error/warning toast for failure, not a success toast.
4. Is this a **passive / background** feature? → use Tier 4.

#### Current usages

| Location | Trigger | Level |
|----------|---------|-------|
| `hooks/useRecipeNote.ts` | localStorage write failure | `error` |
| `hooks/useFavorites.ts` | localStorage write failure | `error` |
| `components/CookModeButton.tsx` | Wake lock permission denied | `warning` |
| `components/RecipeActions.tsx` | Clipboard write unavailable | `warning` |
| `app/recipes/[slug]/ingredients-section.tsx` | Clipboard write unavailable | `warning` |
| `app/favorites/FavoritesContent.tsx` | Partial recipe fetch failure | `warning` |

---

### Tier 3 — Inline UI Feedback

**When to use:** An interactive element already communicates the result through its own visual state change. No toast needed.

**Examples:**
- Clipboard copy button → text changes to "¡Copiado!" for 2 seconds
- Favorite heart icon → fills/unfills immediately
- Cook mode button → label changes to "Pantalla activa"
- Note textarea → auto-saves silently as the user types

**Rule:** Add a toast only for the *failure* case (Tier 2). Never add a redundant success toast on top of existing inline feedback.

---

### Tier 4 — Silent / Log-Only

**When to use:** A background feature fails gracefully and the user's primary task is unaffected. Surfacing the error would be noise.

**Implementation:** Empty `catch {}` or `console.error()` in development.

#### Current silent failures (intentional)

| Location | Reason |
|----------|--------|
| `hooks/useRecipeNote.ts` — read catch | SSR hydration edge case; user is unaware |
| `hooks/useFavorites.ts` — read catch | Returns empty set; not a user action |
| `hooks/useRecentlyViewed.ts` — write catch | Passive background tracking |
| `hooks/usePersistedSet.ts` — write catch | Passive state tracking |
| `components/RecipeTimer.tsx` — AudioContext catch | SSR environment; no user action |
| `components/CookModeButton.tsx` — reacquire catch | Tab-switch edge case; UI already corrects itself |
| `components/RecipeActions.tsx` — share cancel catch | User explicitly cancelled the share sheet |

---

## Decision Flowchart

```
Did the user explicitly trigger the action?
├── No  → Tier 4 (silent)
└── Yes → Did the failure leave the user in a misleading state?
           ├── No, there's inline UI feedback for both outcomes → Tier 3 + Tier 2 for failure only
           └── Yes, or no feedback at all → Is the entire page broken?
                  ├── Yes → Tier 1 (error boundary / 404)
                  └── No  → Tier 2 (toast — error or warning depending on severity)
```

---

## Adding New Error Paths

1. Identify which tier applies using the flowchart above.
2. For Tier 2, import `sileo` and choose the appropriate level (`error` > `warning` > `info`).
3. Write the message in Spanish (the app's language), keep it brief, and hint at the cause and/or next step.
4. Update the **Current usages** table in this document.

**Message tone guide:**
- `error`: "No se pudo guardar X. [Reason if known]."
- `warning`: "No se pudo completar X. [What to do instead]."
- `success`: "X guardado correctamente." (use sparingly)
