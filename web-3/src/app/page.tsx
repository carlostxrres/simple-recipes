import Gallery from "@/app/sections/Gallery"
import Hero from "@/app/sections/Hero"

export default function Home() {
  return (
    <main className="flex flex-col gap-20">
      <Hero />
      <Gallery />
    </main>
  )
}
