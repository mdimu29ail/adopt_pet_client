// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import tailwindcss from '@tailwindcss/vite';
// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [tailwindcss(), react()],
// });
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    rollupOptions: {
      output: {
        // এই লজিকটি বড় লাইব্রেরিগুলোকে (যেমন: Framer Motion, Lucide, icons) আলাদা ছোট ফাইলে ভাগ করে দেবে
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString();
          }
        },
      },
    },
    // ওয়ার্নিং লিমিট বাড়িয়ে ১০০০ কিলোবাইট করা হলো
    chunkSizeWarningLimit: 1000,
  },
});
