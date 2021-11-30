import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { i18nextScanner } from 'vite-plugin-i18next-scanner';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    i18nextScanner({
      langs: ['en', 'zh'],
    }),
  ],
});
