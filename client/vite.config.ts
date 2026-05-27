import { ConfigEnv, defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }: ConfigEnv) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    base: "./",
    plugins: [react()],
    build: {
      emptyOutDir: true,
      outDir: mode === 'production' ? './dist' : '../server/build/www',
      rollupOptions: {},
      sourcemap: true,
    },
    server: {
      host: process.env.VITE_HOST,
      port: Number(process.env.VITE_PORT ?? '0000'),
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL,
          changeOrigin: true,
        },
        '/auth': {
          target: process.env.LOGTO_ENDPOINT,
          changeOrigin: true,
        },
      },
    },
  });
};
