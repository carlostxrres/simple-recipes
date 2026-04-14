import Gallery from "./sections/Gallery"
import Hero from "./sections/Hero"

interface HomeProps {
  searchParams: Promise<{ tag?: string | string[] }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const selectedTags = params.tag
    ? Array.isArray(params.tag)
      ? params.tag
      : [params.tag]
    : []

  return (
    <main className="flex flex-col gap-20">
      <Hero />
      <Gallery selectedTags={selectedTags} />
    </main>
  )
}
