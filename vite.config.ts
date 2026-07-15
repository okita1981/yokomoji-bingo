import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Buzzword Quest',
        short_name: 'Buzzword Quest',
        description: '意識だけで上まで行け。横文字を集め、組織の頂点へ。',
        theme_color: '#0b1e3d',
        background_color: '#0b1e3d',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // 称号カード画像(20枚・合計約4.3MB)もプリキャッシュ対象に含める。
        // 最適化後の合計容量が小さいため、案A（全画像プリキャッシュ）を採用した。詳細はdocs/title-card-assets.md参照。
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webp}'],
      },
    }),
  ],
})
