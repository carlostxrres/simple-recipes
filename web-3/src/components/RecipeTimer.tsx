"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconRefresh,
  IconClock,
} from "@tabler/icons-react"

interface RecipeTimerProps {
  totalMinutes: number
}

function playDoneSound() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = "sine"
    // Three descending tones
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15)
    osc.frequency.setValueAtTime(440, ctx.currentTime + 0.3)
    gain.gain.setValueAtTime(0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.6)
  } catch {
    // AudioContext not available (e.g. SSR)
  }
}

export default function RecipeTimer({ totalMinutes }: RecipeTimerProps) {
  const total = totalMinutes * 60
  const [secondsLeft, setSecondsLeft] = useState(total)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = null
  }, [])

  useEffect(() => {
    if (!running) {
      stop()
      return
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          stop()
          setRunning(false)
          playDoneSound()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return stop
  }, [running, stop])

  function reset() {
    stop()
    setRunning(false)
    setSecondsLeft(total)
  }

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const timeDisplay = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  const isDone = secondsLeft === 0
  const pct = secondsLeft / total

  return (
    <div className="no-print inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-3.5 py-2 text-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
      {/* Progress arc / icon */}
      <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
        <svg className="absolute inset-0 h-5 w-5 -rotate-90" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor"
            className="text-slate-200 dark:text-slate-700" strokeWidth="2" />
          <circle cx="10" cy="10" r="8" fill="none"
            stroke="currentColor"
            className={isDone ? "text-green-500" : running ? "text-primary-500" : "text-slate-400"}
            strokeWidth="2"
            strokeDasharray={`${2 * Math.PI * 8}`}
            strokeDashoffset={`${2 * Math.PI * 8 * (1 - pct)}`}
            strokeLinecap="round"
            style={{ transition: running ? "stroke-dashoffset 1s linear" : "none" }}
          />
        </svg>
        <IconClock
          className={`h-3 w-3 ${isDone ? "text-green-500" : running ? "text-primary-500" : "text-slate-400"}`}
        />
      </div>

      {/* Time display */}
      <span
        className={`min-w-[3.5rem] font-mono font-semibold tabular-nums ${
          isDone ? "text-green-600 dark:text-green-400" : "text-text-primary"
        }`}
      >
        {isDone ? "¡Listo!" : timeDisplay}
      </span>

      {/* Controls */}
      <button
        type="button"
        onClick={() => setRunning((r) => !r)}
        disabled={isDone}
        aria-label={running ? "Pausar temporizador" : "Iniciar temporizador"}
        className="text-slate-500 transition hover:text-slate-900 disabled:opacity-40 dark:text-slate-400 dark:hover:text-slate-100"
      >
        {running ? (
          <IconPlayerPause className="h-4 w-4" />
        ) : (
          <IconPlayerPlay className="h-4 w-4" />
        )}
      </button>
      <button
        type="button"
        onClick={reset}
        aria-label="Reiniciar temporizador"
        className="text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
      >
        <IconRefresh className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
