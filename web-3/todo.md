# Simple Eats — Web Todo

## Bugs & Code Quality (fixed)
- [x] Remove debug `console.log` leaking fetch URLs to the console in production (`api.ts:48`)
- [x] Fix broken dynamic Tailwind class in `StepsSection` — `grid-cols-${expr}` is never included in the Tailwind build, so the multi-column layout was silently broken
- [x] Fix `Ingredient` component defined inside `IngredientsSection` — React treats it as a new type on every render, remounting every ingredient row and resetting the image-visible state on each servings change
- [x] Fix non-serializable `Map` prop crossing the Server→Client boundary — `allAllergens` was a `Map` passed as a prop to Client Components (`IngredientsSection`, `AllergensSection`); converted to a plain array
- [x] Remove 4 wasteful API calls in `Gallery.tsx` — `getTags`, `getCuisines`, `getAllergens`, `getIngredients` were all fetched but their results were never used
- [x] Remove unnecessary `"use client"` from `AllergensSection`, `NutritionSection`, `StepsSection` — none of them use hooks or browser APIs
- [x] Fix placeholder metadata and wrong `lang="en"` in `layout.tsx` — app content is in Spanish
- [x] Name all anonymous function exports (layout, Header, Footer, Gallery, RecipeCard)
- [x] Remove ~100 lines of dead commented-out old implementation in `RecipeCard.tsx`
- [x] Remove leftover commented-out framer-motion imports across recipe page sections
- [x] Remove `const Comp = "button"` indirection in `Button.tsx`
- [x] Remove unused `index` prop from `RecipeCard`

## Incomplete Features (fixed)
- [x] **Tag filter in Gallery**: filter panel opens/closes with a button; button shows a badge with the count of active filters; multiselect tag dropdown using URL params (`?tag=slug`)
- [x] **Mobile header menu**: hamburger toggles a mobile nav panel revealing the Upload Recipe link; icon swaps to X when open
- [x] **Dark mode toggle**: footer sun/moon button wired to `next-themes`; respects system preference on first load
- [x] **Upload recipe page**: `/new` renders a Spanish-language "coming soon" placeholder

## Configuration & Environment (fixed)
- [x] **Supabase hostname** moved to `NEXT_PUBLIC_SUPABASE_URL` env var — used in `next.config.ts` and `ingredients-section.tsx`; falls back to hardcoded value for local dev without `.env.local`
- [x] **`.env.example`** added — documents `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SUPABASE_URL`
- [x] **TypeScript `strict: true`** enabled — zero new errors; also updated `moduleResolution` from deprecated `node` to `bundler`
