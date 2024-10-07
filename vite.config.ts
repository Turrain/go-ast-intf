import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy';
// https://vitejs.dev/config/
export default defineConfig({

  optimizeDeps: {
    exclude: ['ort-wasm-simd-threaded'],
  },
  base: './',
  plugins: [react(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/onnxruntime-web/dist/ort-wasm.wasm',
          dest: '.'
        },
        {
          src: 'node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm',
          dest: '.'
        },
        {
          src: 'node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js',
          dest: '.'
        },
        {
          src: 'node_modules/@ricky0123/vad-web/dist/*.onnx',
          dest: '.'
        }
      ]
    })
  ],
})
