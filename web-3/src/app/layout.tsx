import type { Metadata } from "next"
import Header from "./layout/Header"
import Footer from "./layout/Footer"
import ThemeProvider from "../components/ThemeProvider"
import ScrollToTop from "../components/ScrollToTop"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "sileo"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Simple Eats",
  description: "Descubre recetas sencillas elegidas por su sabor y simplicidad.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Skip to content — visually hidden until focused */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
          >
            Ir al contenido principal
          </a>
          <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
            <div className="relative mx-auto flex min-h-screen w-full max-w-295 flex-col px-6 pt-6 pb-6 sm:px-10 lg:px-16 space-y-8">
              <Header />
              <div id="main-content">{children}</div>
              <Footer />
              <ScrollToTop />
              <Toaster position="bottom-right" />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
