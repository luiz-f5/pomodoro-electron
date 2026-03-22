import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useSound } from '../hooks/useSound'

const TimerContext = createContext(null)

export function TimerProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'pomodoro')
  const [minutes, setMinutes] = useState('25:00:5:00')
  const [loops, setLoops] = useState(1)

  const [phase, setPhase] = useState('idle')
  const [currentLoop, setCurrentLoop] = useState(0)
  const [remaining, setRemaining] = useState(25 * 60)
  const [total, setTotal] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [message, setMessage] = useState('Configure e inicie sua sessão')
  const [batteryAlert, setBatteryAlert] = useState(false)

  const intervalRef = useRef(null)
  const stateRef = useRef({})

  const api = typeof window !== 'undefined' ? window.widgetAPI : null
  const notify = typeof window !== 'undefined' ? window.notifyAPI : null
  const playSound = useSound()

  function parseTime(val) {
    const [fm, fs, bm, bs] = val.split(':').map(Number)
    return { focus: fm * 60 + fs, brk: bm * 60 + bs }
  }

  useEffect(() => {
    stateRef.current = { phase, currentLoop, loops, minutes, remaining, running }
  }, [phase, currentLoop, loops, minutes, remaining, running])

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    if (!api?.onMudancaEnergia) return
    api.onMudancaEnergia((_event, onBattery) => setBatteryAlert(onBattery))
  }, [])

  useEffect(() => {
    if (phase === 'idle') {
      const { focus } = parseTime(minutes)
      setRemaining(focus)
      setTotal(focus)
    }
  }, [minutes])

  const clearTimer = useCallback(() => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
  }, [])

  const goToNextPhase = useCallback(
    (currentPhase, currentLoopVal, loopsVal, minVal) => {
      const { focus, brk } = parseTime(minVal)

      if (currentPhase === 'focus') {
        const nextLoop = currentLoopVal + 1
        if (nextLoop >= loopsVal) {
          clearTimer()
          setRunning(false)
          setPhase('done')
          setRemaining(0)
          setCurrentLoop(nextLoop)
          setMessage('🎉 Sessão completa! Ótimo trabalho.')
          notify?.send('Pomodoro', 'Sessão completa! Ótimo trabalho.')
          playSound()
          api?.pararSessao()
        } else {
          setCurrentLoop(nextLoop)
          setPhase('break')
          setRemaining(brk)
          setTotal(brk)
          setMessage('Hora de descansar!')
          notify?.send('Pomodoro', 'Foco concluído! Hora de descansar.')
          playSound()
        }
      } else {
        setPhase('focus')
        setRemaining(focus)
        setTotal(focus)
        setMessage('Sessão de foco em andamento...')
        notify?.send('Pomodoro', 'Pausa concluída! De volta ao foco.')
        playSound()
      }
    },
    [clearTimer, api, notify, playSound]
  )

  const startInterval = useCallback(() => {
    clearTimer()
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          const { phase: p, currentLoop: cl, loops: l, minutes: m } = stateRef.current
          goToNextPhase(p, cl, l, m)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [clearTimer, goToNextPhase])

  const startSession = useCallback(async () => {
    if (running) return
    const ok = await api?.iniciarSessao()
    if (api && !ok) return

    const { focus } = parseTime(minutes)
    setPhase('focus')
    setCurrentLoop(0)
    setRemaining(focus)
    setTotal(focus)
    setRunning(true)
    setMessage('Sessão de foco iniciada!')
    notify?.send('Pomodoro', 'Sessão de foco iniciada!')
    playSound()
    startInterval()
  }, [running, api, minutes, notify, playSound, startInterval])

  const stopSession = useCallback(async () => {
    if (!running) return
    await api?.pararSessao()
    clearTimer()
    setRunning(false)
    setMessage('Sessão de foco parada')
    notify?.send('Pomodoro', 'A sessão de foco foi parada')
    playSound()
  }, [running, api, clearTimer, notify, playSound])

  const cancelSession = useCallback(async () => {
    await api?.pararSessao()
    clearTimer()
    setRunning(false)
    setPhase('idle')
    setCurrentLoop(0)
    const { focus } = parseTime(minutes)
    setRemaining(focus)
    setTotal(focus)
    setMessage('Sessão cancelada.')
    notify?.send('Pomodoro', 'Sessão cancelada!')
    playSound()
  }, [api, clearTimer, minutes, notify, playSound])

  const resumeSession = useCallback(() => {
    setRunning(true)
    setMessage(phase === 'break' ? 'Hora de descansar!' : 'Sessão de foco em andamento...')
    startInterval()
  }, [phase, startInterval])

  return (
    <TimerContext.Provider
      value={{
        theme,
        setTheme,
        minutes,
        setMinutes,
        loops,
        setLoops,
        phase,
        running,
        currentLoop,
        remaining,
        total,
        message,
        batteryAlert,
        startSession,
        stopSession,
        cancelSession,
        resumeSession
      }}
    >
      {children}
    </TimerContext.Provider>
  )
}

export function useTimer() {
  return useContext(TimerContext)
}
