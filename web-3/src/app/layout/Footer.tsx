import {
  IconBrandX,
  IconBrandLinkedin,
  IconBrandInstagram,
  IconBrandDiscord,
} from "@tabler/icons-react"
import ThemeToggle from "../../components/ThemeToggle"

export default function Footer() {
  const links = [
    { href: "/terms", name: "Terms" },
    { href: "/privacy", name: "Privacy" },
    { href: "/faq", name: "FAQ" },
    { href: "mailto:support@simpleeats.xyz", name: "Contact" },
  ]

  const socials = [
    {
      name: "X",
      href: "https://x.com/simpleeats",
      icon: IconBrandX,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/simpleeats/",
      icon: IconBrandLinkedin,
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/simple-eats/",
      icon: IconBrandInstagram,
    },
    {
      name: "Discord",
      href: "https://discord.com/invite/some-id",
      icon: IconBrandDiscord,
    },
  ]

  return (
    <div className="mx-auto w-full max-w-295 px-6 sm:px-10 lg:px-16">
      <footer className="mt-4 border-t border-slate-200 pt-4 pb-12 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p>© 2026 Simple Eats</p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          {links.map((link) => (
            <a
              className="transition hover:text-slate-900 dark:hover:text-slate-100"
              href={link.href}
              key={link.name}
            >
              {link.name}
            </a>
          ))}

          {socials.map((social) => {
            const Icon = social.icon
            return (
              <a
                key={social.name}
                aria-label={`Simple Eats on ${social.name}`}
                className="inline-flex h-5 w-5 items-center justify-center transition hover:text-slate-900 dark:hover:text-slate-100"
                rel="noopener noreferrer"
                target="_blank"
                href={social.href}
              >
                <Icon className="h-5 w-5" />
              </a>
            )
          })}

          <ThemeToggle />
        </div>
      </footer>
    </div>
  )
}
