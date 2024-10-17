
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default ({mode}: {mode: string}) => {
  console.log(mode);
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  return defineConfig({

    optimizeDeps: {
      exclude: ['ort-wasm-simd-threaded'],
    },
    base: './',
    build: {
      outDir: 'build'
    },
    plugins: [
 
      react(),
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
}

