import Gallery from "./sections/Gallery"
import Hero from "./sections/Hero"

export default function Home() {
  return (
    <main className="flex flex-col gap-20">
      <Hero />
      <Gallery />
    </main>
  )
}
