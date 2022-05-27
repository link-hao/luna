import { defineConfig, Plugin } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'
import { join } from 'path'
import yaml from '@rollup/plugin-yaml'

const cwd = process.cwd()

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => {
            return ['feDistantLight'].includes(tag)
          },
        },
      },
    }),
    vueJsx(),
    (yaml() as unknown) as Plugin,
  ],
  resolve: {
    alias: {
      '@': join(cwd, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `@import "@/styles/variables.less";`,
      },
    },
  },
})
