import { useEffect } from 'react'
import { TimerProvider, useTimer } from './context/TimerContext'
import Window from './components/Window'
import Timer from './components/Timer'
import Options from './components/Options'

function AppInner() {
  const { theme } = useTimer()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div id="theme" className={`app ${theme}`}>
      <Window />
      <Timer />
      <Options />
    </div>
  )
}

function App() {
  return (
    <TimerProvider>
      <AppInner />
    </TimerProvider>
  )
}

export default App
