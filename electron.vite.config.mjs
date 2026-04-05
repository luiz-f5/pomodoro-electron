import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    main: {
      plugins: [externalizeDepsPlugin()],
      define: {
        'import.meta.env.VITE_DATABASE_PG': JSON.stringify(env.VITE_DATABASE_PG),
        'import.meta.env.VITE_USER_PG': JSON.stringify(env.VITE_USER_PG),
        'import.meta.env.VITE_PASS_PG': JSON.stringify(env.VITE_PASS_PG),
        'import.meta.env.VITE_HOST_PG': JSON.stringify(env.VITE_HOST_PG),
        'import.meta.env.VITE_PORT_PG': JSON.stringify(env.VITE_PORT_PG),
        'import.meta.env.VITE_FREESOUND_TOKEN': JSON.stringify(env.VITE_FREESOUND_TOKEN)
      },
      build: {
        rollupOptions: {
          external: ['path', 'child_process']
        }
      }
    },
    preload: {
      plugins: [externalizeDepsPlugin()],
      build: {
        rollupOptions: {
          external: ['path', 'child_process']
        }
      }
    },
    renderer: {
      resolve: {
        alias: {
          '@renderer': resolve('src/renderer/src')
        }
      },
      plugins: [react()],
      build: {
        rollupOptions: {
          input: {
            index: resolve(__dirname, 'src/renderer/index.html'),
            settings: resolve(__dirname, 'src/renderer/settings.html')
          }
        }
      }
    }
  }
})
