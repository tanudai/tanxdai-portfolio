// Browser preview of the site's FilmPlayer, used to check frame parity with Remotion.
// Open /?id=01&at=5000 to freeze a film at a moment; omit `at` to play.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  root: fileURLToPath(new URL('./preview', import.meta.url)),
  plugins: [react()],
  resolve: { alias: { react: fileURLToPath(new URL('./node_modules/react', import.meta.url)), 'react-dom': fileURLToPath(new URL('./node_modules/react-dom', import.meta.url)) } },
  server: { port: 5190, fs: { allow: [fileURLToPath(new URL('..', import.meta.url))] } },
});
