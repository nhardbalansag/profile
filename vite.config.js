import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
     VitePWA({
      includeAssets: ['favicon.ico', '/src/assets/images/ten/logo2.png', 'mask-icon.svg'],
       registerType: 'autoUpdate',
      manifest: {
        name: 'My Awesome App',
        short_name: 'MyApp',
        description: 'My Awesome App description',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/src/assets/images/ten/logo2.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/src/assets/images/ten/logo2.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base:'/'
})
