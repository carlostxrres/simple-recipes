import FigureCard from "@/components/FigureCard"

export default function Hero() {
  return (
    <section className="flex flex-col gap-8 text-balance mt-12">
      {/* <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
        Community prompt studio &amp; gallery
      </div> */}

      <h1 className="text-4xl font-semibold leading-[1.05] text-slate-900 sm:text-5xl lg:text-6xl dark:text-slate-100">
        Real food. <em>Few ingredients</em>. Big flavor.
      </h1>

      <p className="text-slate-600 dark:text-slate-300 max-w-2xl text-base sm:text-lg">
        A curated recipe gallery for busy humans. Find delicious meals with just
        a few ingredients, minimal prep, and zero waste. Cook faster, eat
        better, and enjoy food that actually makes you feel good.
      </p>

      {/* To do: add figures here: */}
      {/* <div className="grid gap-4 sm:grid-cols-3">
        <FigureCard figure="154+" name="Prompts shared this we" />
        <FigureCard figure="1.6K+" name="Creators contributing" />
        <FigureCard figure="58.5K+" name="Total likes given" />
      </div> */}
    </section>
  )
}

// Option 1 — Closest to your original (clean & modern)
// Cook more with <em>less</em>. Discover quick, healthy recipes made with real food.
// A curated recipe gallery for busy humans. Find delicious meals with just a few ingredients, minimal prep, and zero waste. Cook faster, eat better, and enjoy food that actually makes you feel good.

// Option 2 — Slightly more punchy / lifestyle-forward
// Real food. <em>Few ingredients</em>. Big flavor.
// Simple, fast, and healthy recipes designed to cut waste—not taste. Cook delicious meals in minutes using real ingredients you already have, without sacrificing nutrition or joy.

// Option 3 — More playful, still premium
// Less shopping. <em>More cooking</em>. Better eating.
// Discover quick, wholesome recipes that keep ingredients short and flavor high. No waste, no ultra-processed nonsense—just real food that’s easy to make and genuinely delicious.

// Option 4 — Ultra-minimal / startup-y
// Eat well, without the mess.
// Quick, healthy recipes with few ingredients and real food. Designed to save time, reduce waste, and make everyday cooking feel effortless.
