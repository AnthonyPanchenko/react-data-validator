import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // for TypeScript path alias import like : @/x/y/z
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // https://github.com/madyankin/postcss-modules
  // node_modules/vite/dist/node/index.d.ts
  // CSSOptions > CSSModulesOptions
  css: {
    modules: {
      scopeBehaviour: 'local',
      generateScopedName: '[local]',
      localsConvention: null
    }
  },
  publicDir: 'public',
  server: {
    host: true,
    base: '/',
    open: true,
    port: 5173
  }
});
