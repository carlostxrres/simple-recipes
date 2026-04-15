import type { Metadata } from "next"
import Header from "./layout/Header"
import Footer from "./layout/Footer"
import ThemeProvider from "../components/ThemeProvider"
import ScrollToTop from "../components/ScrollToTop"
import { Geist, Geist_Mono } from "next/font/google"
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
          <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
            <div className="relative mx-auto flex min-h-screen w-full max-w-295 flex-col px-6 pt-6 b-6 sm:px-10 lg:px-16 space-y-8">
              <Header />
              {children}
              <Footer />
              <ScrollToTop />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
