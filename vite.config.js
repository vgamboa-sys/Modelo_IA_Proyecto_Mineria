import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Si la solicitud comienza con '/datos/api', Vite la reenvía a la URL de destino
      '/datos/api': {
        target: 'http://44.206.67.3:8000', 
        changeOrigin: true, // Esto es necesario para que el servidor de la API piense que la solicitud viene de su propio origen
        // Esto elimina '/datos/api' de la ruta final antes de enviarla al destino.
        // Pero dado que tu API incluye '/datos/api' en la URL base, quizás no sea necesario,
        // sin embargo, para evitar ambigüedades, lo añadiremos:
        rewrite: (path) => path.replace(/^\/datos\/api/, '/datos/api'),
      },
    }
  }
})
