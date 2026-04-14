"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconChevronDown } from "@tabler/icons-react"
import { Card } from "@/components/ui/Card"

interface CollapsibleSectionProps {
  /** Can be a plain string or JSX (e.g. title + counter badge) */
  title: React.ReactNode
  icon: React.ReactNode
  defaultOpen?: boolean
  children: React.ReactNode
}

export default function CollapsibleSection({
  title,
  icon,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section>
      <Card className="p-0">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-between px-6 py-5 text-left"
        >
          <h2 className="flex items-center gap-2 text-xl font-bold text-text-primary">
            <span className="text-primary-500">{icon}</span>
            {title}
          </h2>
          <IconChevronDown
            className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="content"
              className="collapsible-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <div className="px-6 pb-6">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </section>
  )
}
