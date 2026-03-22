import { useTimer } from '../context/TimerContext'
import ButtonStart from './Buttons/ButtonStart'
import ButtonStop from './Buttons/ButtonStop'
import ButtonCancel from './Buttons/ButtonCancel'

function Options() {
  const { running, phase } = useTimer()

  return (
    <div className="options">
      <ButtonStart disabled={running} />
      <ButtonStop disabled={!running} />
      <ButtonCancel disabled={phase === 'idle' || phase === 'done'} />
    </div>
  )
}

export default Options
