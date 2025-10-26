import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'ইসলামী মাসআলা-মাসায়েল',
        short_name: 'মাসআলা',
        description: 'ইসলামী মাসআলা-মাসায়েলের নির্ভরযোগ্য প্ল্যাটফর্ম',
        theme_color: '#16a34a',
        background_color: '#ffffff',
        display: 'standalone',
        lang: 'bn',
        dir: 'ltr',
        orientation: 'portrait',
        categories: ['education', 'religious'],
        icons: [
          {
            src: 'favicon-jug.svg',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'favicon-jug.svg',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'favicon-jug.svg',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
})