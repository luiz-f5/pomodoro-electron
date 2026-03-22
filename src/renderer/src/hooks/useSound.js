import { useEffect } from 'react'
import notificationSound from '../assets/sounds/notification.wav'

export function useSound() {
  const play = () => {
    const audio = new Audio(notificationSound)
    audio.play().catch((err) => console.error('playSound error:', err))
  }

  useEffect(() => {
    const handler = () => play()
    window.addEventListener('pomodoro:play-sound', handler)
    return () => window.removeEventListener('pomodoro:play-sound', handler)
  }, [])

  return play
}
