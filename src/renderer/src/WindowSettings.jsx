import Config from './components/Config'
import { TimerProvider } from './context/TimerContext'
export default function WindowSettings() {
  return (
    <TimerProvider>
      <Config />
    </TimerProvider>
  )
}
