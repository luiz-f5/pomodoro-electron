import { useTimer } from '../../context/TimerContext'
import Button from '../Template/Button'

function ButtonStart({ disabled }) {
  const { startSession, resumeSession, phase } = useTimer()

  const isPaused = !disabled && (phase === 'focus' || phase === 'break')
  const label = isPaused ? 'Retomar' : 'Iniciar Sessão de Foco'
  const handler = isPaused ? resumeSession : startSession

  return <Button className="btn-start" value={label} func={handler} disabled={disabled} />
}

export default ButtonStart
