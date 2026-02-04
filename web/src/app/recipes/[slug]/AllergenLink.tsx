"use client"

interface AllergenLinkProps {
  number: number
  children: React.ReactNode
}

export function AllergenLink({ number, children }: AllergenLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.getElementById(`allergen-${number}`)
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" })
      // Remove class first to allow re-triggering the animation
      target.classList.remove("highlight")
      // Force reflow
      void target.offsetWidth
      target.classList.add("highlight")
    }
  }

  return (
    <a
      href={`#allergen-${number}`}
      onClick={handleClick}
      className="text-orange-600 hover:text-orange-800 hover:underline mr-1"
    >
      {children}
    </a>
  )
}
