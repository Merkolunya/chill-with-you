import { useState, useEffect, useRef, useCallback } from 'react'

export function useTimer({ workMin, breakMin, onSessionComplete }) {
  const [mode, setMode] = useState('work')
  const [time, setTime] = useState(workMin * 60)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  // Sync time when workMin/breakMin change and not running
  useEffect(() => {
    if (!running) {
      setTime(mode === 'work' ? workMin * 60 : breakMin * 60)
    }
  }, [workMin, breakMin, mode, running])

  useEffect(() => {
    if (running && time > 0) {
      intervalRef.current = setInterval(() => setTime((t) => t - 1), 1000)
    } else if (time === 0 && running) {
      setRunning(false)

      // Play notification sound
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = 660
        gain.gain.value = 0.15
        osc.start()
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
        osc.stop(ctx.currentTime + 0.8)
      } catch {
        // audio not available
      }

      if (mode === 'work') {
        onSessionComplete?.()
        setMode('break')
        setTime(breakMin * 60)
      } else {
        setMode('work')
        setTime(workMin * 60)
      }
    }

    return () => clearInterval(intervalRef.current)
  }, [running, time, mode, workMin, breakMin, onSessionComplete])

  const toggle = useCallback(() => setRunning((r) => !r), [])

  const reset = useCallback(() => {
    setRunning(false)
    setMode('work')
    setTime(workMin * 60)
  }, [workMin])

  const totalSec = mode === 'work' ? workMin * 60 : breakMin * 60
  const progress = 1 - time / totalSec
  const elapsed = totalSec - time
  const handAngle = (elapsed / totalSec) * 360

  return { mode, time, running, progress, handAngle, toggle, reset }
}
