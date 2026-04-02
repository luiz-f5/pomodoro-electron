import { useTimer } from '../context/TimerContext'
import Minutes from './Selects/Minutes'
import Times from './Selects/Times'
import Themes from './Selects/Themes'

function Config() {
  const { theme, setTheme, minutes, setMinutes, loops, setLoops, running } = useTimer()

  return (
    <div className="config">
      <div className="config-inner">

        <span className="config-section-label">Timer</span>

        <Minutes value={minutes} onChange={setMinutes} disabled={running} />
        <Times value={String(loops)} onChange={(v) => setLoops(Number(v))} disabled={running} />

        <div className="config-divider" />

        <span className="config-section-label">Aparência</span>

        <Themes theme={theme} setTheme={setTheme} />

        <div className="config-footer">
          <span className={`config-footer__status ${running ? 'active' : ''}`}>
            {running ? '● em execução' : '● pausado'}
          </span>
          <span className="config-footer__status">v1.0.0</span>
        </div>

      </div>
    </div>
  )
}

export default Config
