import ButtonMin from './Buttons/ButtonMin'
import ButtonMax from './Buttons/ButtonMax'
import ButtonClose from './Buttons/ButtonClose'
import ButtonReload from './Buttons/ButtonReload'
import ButtonForceReload from './Buttons/ButtonReload'
import ButtonDebug from './Buttons/ButtonDebug'
import ButtonHelp from './Buttons/ButtonHelp'
import ButtonZoomIn from './Buttons/ButtonZoomIn'
import ButtonZoomOut from './Buttons/ButtonZoomOut'
import ButtonZoomReset from './Buttons/ButtonZoomReset'
import ButtonFullScreen from './Buttons/ButtonFullScreen'
import ButtonQuit from './Buttons/ButtonQuit'
import ButtonSettings from './Buttons/ButtonSettings'

function Window() {
  return (
    <div className="window">
      <div className="window-settings">
        <ButtonQuit />
        <ButtonReload />
        <ButtonForceReload />
        <ButtonDebug />
        <ButtonZoomIn />
        <ButtonZoomOut />
        <ButtonZoomReset />
        <ButtonFullScreen />
        <ButtonHelp />
        <ButtonSettings />
      </div>
      <div className="window-controls">
        <ButtonMin />
        <ButtonMax />
        <ButtonClose />
      </div>
    </div>
  )
}

export default Window
