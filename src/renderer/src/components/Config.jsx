import { useTimer } from '../context/TimerContext'
import Minutes from './Selects/Minutes'
import Times from './Selects/Times'
import Themes from './Selects/Themes'

function Config() {
  const { theme, setTheme, minutes, setMinutes, loops, setLoops, running } = useTimer()

  return (
    <div className="config">
      <Minutes value={minutes} onChange={setMinutes} disabled={running} />
      <Times value={String(loops)} onChange={(v) => setLoops(Number(v))} disabled={running} />
      <Themes theme={theme} setTheme={setTheme} />
    </div>
  )
}

export default Config
