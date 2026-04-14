"use client"

import Masonry from "react-masonry-css"

const breakpointCols = {
  default: 3,
  1024: 2,
  640: 1,
}

export default function MasonryGrid({ children }: { children: React.ReactNode }) {
  return (
    <Masonry
      breakpointCols={breakpointCols}
      className="flex gap-5 sm:gap-6"
      columnClassName="flex flex-col gap-5 sm:gap-6"
    >
      {children}
    </Masonry>
  )
}
