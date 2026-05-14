import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
<<<<<<< HEAD
  base: '/midiflix/',
=======
  base: '/',
>>>>>>> 12c460f3e5cd1fea2bde5ff97aa27609aae68530
  plugins: [react(),
    tailwindcss()
  ],
})
