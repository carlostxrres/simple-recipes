"use client"

import { useState, useEffect, useRef } from "react"
import { IconChefHat, IconZzz } from "@tabler/icons-react"
import { sileo } from "sileo"

export default function CookModeButton() {
  const [active, setActive] = useState(false)
  const [supported, setSupported] = useState(false)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  useEffect(() => {
    setSupported("wakeLock" in navigator)
  }, [])

  // Re-acquire the lock when the page becomes visible again (e.g. after tab switch)
  useEffect(() => {
    if (!active) {
      return
    }
    async function reacquire() {
      if (document.visibilityState === "visible") {
        try {
          wakeLockRef.current = await navigator.wakeLock.request("screen")
        } catch {
          setActive(false)
        }
      }
    }
    document.addEventListener("visibilitychange", reacquire)
    return () => document.removeEventListener("visibilitychange", reacquire)
  }, [active])

  async function toggle() {
    if (active) {
      await wakeLockRef.current?.release()
      wakeLockRef.current = null
      setActive(false)
    } else {
      try {
        wakeLockRef.current = await navigator.wakeLock.request("screen")
        setActive(true)
        wakeLockRef.current.addEventListener("release", () => setActive(false))
      } catch {
        sileo.warning({
          title: "Modo cocina no disponible",
          description: "No se pudo mantener la pantalla encendida. Puede que el permiso haya sido denegado.",
        })
      }
    }
  }

  if (!supported) {
    return null
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={active}
      title={active ? "Desactivar modo cocina (la pantalla se apagará)" : "Activar modo cocina (mantiene la pantalla encendida)"}
      className={`no-print inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition-all ${
        active
          ? "border-primary-300 bg-primary-50 text-primary-700 hover:bg-primary-100 dark:border-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
          : "border-slate-200 bg-white/60 text-slate-600 hover:bg-white hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
      }`}
    >
      {active ? (
        <IconChefHat className="h-3.5 w-3.5" />
      ) : (
        <IconZzz className="h-3.5 w-3.5" />
      )}
      {active ? "Pantalla activa" : "Modo cocina"}
    </button>
  )
}
