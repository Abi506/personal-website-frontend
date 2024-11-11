import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        include: ['pdfjs-dist/build/pdf.worker.entry'], // Ensure Vite handles the worker correctly
    },
});
