# Project Context — Simple Eats (web-3)

## What this is
A Next.js 16 / React 19 recipe browsing app backed by a separate Express API at
`http://localhost:3001` (configurable via `NEXT_PUBLIC_API_URL`). Images are stored
in Supabase Storage. The stack is TypeScript + Tailwind v4 + CVA.

Two pages exist so far:
- `/` — Hero + masonry gallery of recipe cards
- `/recipes/[slug]` — Full recipe detail (ingredients, steps, nutrition, utensils, allergens)

There is no auth and no mutations; the frontend is read-only.

---

## What was done in this session

### Bug that triggered the session
`Gallery.tsx` had both `"use client"` and `async function` — React doesn't support
async client components, which caused an infinite render/retry loop. Removed `"use client"`.
`react-masonry-css` then needed a client boundary; extracted into
`src/components/MasonryGrid.tsx`.

### Code quality & bug fixes applied
1. **Removed debug `console.log`** in `api.ts` that was leaking fetch URLs in production.
2. **Fixed broken dynamic Tailwind class** in `StepsSection` — `grid-cols-${expr}` is
   never emitted by the Tailwind build; replaced with static `md:grid-cols-2 xl:grid-cols-3`.
3. **Fixed `IngredientItem` defined inside `IngredientsSection`** — defining a component
   inside another component gives React a new function reference on every render, causing
   full remount (and image-visible state reset) on every servings change. Extracted as
   a proper top-level `IngredientItem` component.
4. **Fixed non-serializable `Map` prop** crossing the Server→Client boundary —
   `allAllergens` was a `Map` built in the server component `page.tsx` and passed to
   Client Components. Maps can't be serialized. Converted to `AllergenEntry[]` (new type
   added to `src/lib/types.ts`) before passing.
5. **Removed 4 wasteful API calls** in `Gallery.tsx` — `getTags`, `getCuisines`,
   `getAllergens`, `getIngredients` were fetched on every homepage load but their results
   were never used.
6. **Removed unnecessary `"use client"`** from `AllergensSection`, `NutritionSection`,
   `StepsSection` — none use hooks or browser APIs.
7. **Fixed placeholder metadata** (`"Create Next App"`) and wrong `lang="en"` in
   `layout.tsx`; app content is in Spanish.
8. **Named all anonymous function exports** across `layout.tsx`, `Header`, `Footer`,
   `Gallery`, `RecipeCard`.
9. **Removed ~100 lines of dead commented-out code** in `RecipeCard.tsx`.
10. **Removed leftover commented-out framer-motion imports** across recipe page sections.
11. **Simplified `Button.tsx`** — removed the pointless `const Comp = "button"` indirection.
12. **Removed unused `index` prop** from `RecipeCard` / `Gallery`.
13. **Fixed unused `index` in `NutritionSection`** map callback (TS diagnostic).

All completed items are also tracked in `todo.md`.

---

## Pending tasks (need decisions or implementation)

### Features that are wired up but non-functional
These exist in the UI but have no logic behind them yet:

| Feature | Where | What's needed |
|---------|-------|---------------|
| Search & filters | `Gallery.tsx` | Component never reads `searchParams`; all filter/search/pagination logic is dead code. Needs a decision: server-side (read `searchParams` prop + URL-driven) or client-side (add state). Filter UI also doesn't exist yet on this page. |
| Mobile nav menu | `Header.tsx` | Hamburger button exists but has no open/close state. |
| Dark mode toggle | `Footer.tsx` | Sun button exists but has no theme-switching logic (e.g. `next-themes`). |
| Upload recipe | `Header.tsx` | "Upload Recipe" button links to `/new`, which has no page. |

### Configuration & environment
- **Supabase hostname hardcoded** in two places: `next.config.ts` (image domain allowlist)
  and `ingredients-section.tsx` (image URL construction). Should become a single
  `NEXT_PUBLIC_SUPABASE_URL` env var.
- **`.env.example` missing** — `NEXT_PUBLIC_API_URL` is the only required var and is
  completely undocumented; it silently falls back to `http://localhost:3001` in production
  if unset.
- **TypeScript `strict: false`** in `tsconfig.json` — null checks and strict function
  types are off. Enabling it may surface latent type errors but will improve safety.

---

## Key files reference

| Path | Role |
|------|------|
| `src/app/page.tsx` | Home page (Server Component) |
| `src/app/sections/Gallery.tsx` | Recipe grid (Server Component, fetches recipes) |
| `src/app/sections/Hero.tsx` | Hero banner (static) |
| `src/app/layout.tsx` | Root layout, metadata |
| `src/app/layout/Header.tsx` | Site header |
| `src/app/layout/Footer.tsx` | Site footer, dark mode button |
| `src/app/recipes/[slug]/page.tsx` | Recipe detail page (Server Component) |
| `src/app/recipes/[slug]/ingredients-section.tsx` | Client — servings control, allergen cross-links |
| `src/app/recipes/[slug]/steps-section.tsx` | Server — preparation steps |
| `src/app/recipes/[slug]/allergens-section.tsx` | Server — allergen summary cards |
| `src/app/recipes/[slug]/nutrition-section.tsx` | Server — nutrition facts |
| `src/app/recipes/[slug]/utensils-section.tsx` | Server — utensils list |
| `src/components/MasonryGrid.tsx` | Client boundary wrapper for react-masonry-css |
| `src/components/RecipeCard.tsx` | Recipe preview card |
| `src/components/ui/` | Badge, Button, Card (CVA-based) |
| `src/lib/api.ts` | All fetch functions + display helpers |
| `src/lib/types.ts` | All TypeScript interfaces incl. `AllergenEntry` |
| `next.config.ts` | Image domain allowlist (Supabase), view transitions |
| `todo.md` | Full issue tracker for this project |
