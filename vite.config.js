import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom plugin to automatically prefix public asset paths with Vite base in JS/JSX files
function baseAssetPrefixPlugin() {
  let base = '/';

  return {
    name: 'vite-plugin-base-asset-prefix',
    configResolved(config) {
      base = config.base || '/';
    },
    transform(code, id) {
      // Normalize slashes for Windows compatibility
      const normalizedId = id.replace(/\\/g, '/');
      if (base === '/' || !normalizedId.includes('/src/') || !/\.(jsx?|tsx?)$/.test(normalizedId)) {
        return null;
      }

      const cleanBase = base.endsWith('/') ? base : `${base}/`;
      const publicPaths = [
        '/Website-Gallery/',
        '/services/',
        '/RENDER IMAGES/',
        '/architects/',
        '/blog-images/',
        '/logo.jpeg',
        '/logo.png',
        '/hero-image.png',
        '/about-video.mp4',
        '/sitemap.xml',
        '/robots.txt'
      ];

      let transformed = code;
      for (const assetPath of publicPaths) {
        const escaped = assetPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(['"\`])${escaped}`, 'g');
        transformed = transformed.replace(regex, `$1${cleanBase}${assetPath.slice(1)}`);
      }

      if (transformed !== code) {
        return {
          code: transformed,
          map: null
        };
      }
      return null;
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    baseAssetPrefixPlugin()
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5005',
        changeOrigin: true
      }
    }
  },
  base: '/',
})
