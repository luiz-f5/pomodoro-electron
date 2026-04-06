import { useEffect, useRef, useCallback } from 'react'
import notificationSound from '../assets/sounds/notification.wav'

const FREESOUND_API = 'https://freesound.org/apiv2/sounds'

async function fetchPreviewUrl(soundId, token) {
  const res = await fetch(`${FREESOUND_API}/${soundId}/?token=${token}`)
  if (!res.ok) throw new Error(`FreeSound ${res.status}`)
  const data = await res.json()
  return data.previews['preview-hq-mp3'] || data.previews['preview-lq-mp3']
}

// Eventos que não interrompem o som atual (tocam por cima)
const OVERLAY = new Set(['TICK'])

function stopAudio(audio) {
  if (!audio) return
  audio.pause()
  audio.currentTime = 0
}

function playAudio(audio, onEnd) {
  audio.currentTime = 0
  audio.play().catch((err) => console.error('playSound error:', err))
  audio.onended = onEnd
}

export function useSound() {
  const cache = useRef({})
  const current = useRef(null)

  async function preload(token, soundIds = {}) {
    if (!token) return
    for (const [event, id] of Object.entries(soundIds)) {
      try {
        const url = await fetchPreviewUrl(id, token)
        cache.current[event] = new Audio(url)
      } catch (err) {
        console.warn(`useSound: falha ao carregar ${event} (id ${id}):`, err.message)
      }
    }
  }

  useEffect(() => {
    Promise.all([
      window.configAPI?.getFreesoundToken(),
      window.settingsAPI?.get()
    ]).then(([token, settings]) => {
      preload(token, settings.soundIds || {})
    })
  }, [])

  useEffect(() => {
    if (!window.themeAPI?.onSettings) return
    const cleanup = window.themeAPI.onSettings((data) => {
      if (data.freesoundApiKey) {
        preload(data.freesoundApiKey, data.soundIds || {})
      }
    })
    return cleanup
  }, [])

  const play = useCallback((event) => {
    const audio = cache.current[event]

    // TICK toca por cima sem interromper o som principal
    if (OVERLAY.has(event)) {
      if (audio) playAudio(audio, () => {})
      return
    }

    // Para o som principal antes de tocar outro
    stopAudio(current.current)
    current.current = null

    if (audio) {
      playAudio(audio, () => {
        current.current = null
      })
      current.current = audio
      return
    }

    // Fallback: som padrão local
    const fallback = new Audio(notificationSound)
    fallback.play().catch((err) => console.error('playSound fallback error:', err))
    current.current = fallback
    fallback.onended = () => {
      current.current = null
    }
  }, [])

  return play
}
