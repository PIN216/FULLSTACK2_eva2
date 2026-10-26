import { defineConfig } from 'vitest/config';

// Configuración de las pruebas unitarias (Vitest). La app sigue compilándose con react-scripts;
// Vitest solo se usa para `npm test`.
export default defineConfig({
  esbuild: { jsx: 'automatic' }, // permite JSX en los archivos .jsx sin importar React en cada uno
  test: {
    environment: 'jsdom', // simula el navegador (document, localStorage...) sin abrir Chrome
    include: ['src/tests/**/*.{test,spec}.{js,jsx}'],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'html'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/tests/**', 'src/index.js']
    }
  }
});
