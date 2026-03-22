import ButtonMin from './Buttons/ButtonMin'
import ButtonMax from './Buttons/ButtonMax'
import ButtonClose from './Buttons/ButtonClose'

function Window() {
  return (
    <div className="window">
      <span className="window-title">Pomodoro</span>
      <div className="window-controls">
        <ButtonMin />
        <ButtonMax />
        <ButtonClose />
      </div>
    </div>
  )
}

export default Window
