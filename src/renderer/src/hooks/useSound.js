import { useEffect, useRef, useCallback } from 'react'
import notificationSound from '../assets/sounds/notification.wav'

const FREESOUND_API = 'https://freesound.org/apiv2/sounds'

// ID do FreeSound para cada evento
const SOUND_IDS = {
  FOCUS_START: 376193,
  FOCUS_TO_BREAK: 376193,
  BREAK_TO_FOCUS: 633159,
  SESSION_COMPLETE: 634089,
  SESSION_STOP: 263802,
  SESSION_CANCEL: 672085
}

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
  const current = useRef(null) // áudio principal em reprodução

  async function preload(token) {
    if (!token) return
    for (const [event, id] of Object.entries(SOUND_IDS)) {
      try {
        const url = await fetchPreviewUrl(id, token)
        cache.current[event] = new Audio(url)
      } catch (err) {
        console.warn(`useSound: falha ao carregar ${event} (id ${id}):`, err.message)
      }
    }
  }

  useEffect(() => {
    window.configAPI?.getFreesoundToken().then((token) => preload(token))
  }, [])

  useEffect(() => {
    if (!window.themeAPI?.onSettings) return
    const cleanup = window.themeAPI.onSettings((data) => {
      if (data.freesoundApiKey) preload(data.freesoundApiKey)
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
