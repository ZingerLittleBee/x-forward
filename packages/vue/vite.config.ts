import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import Icons from 'unplugin-icons/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
    plugins: [vue(), Icons({}), vueJsx({})],
    resolve: {
        alias: [
            {
                find: 'vue',
                replacement: 'vue/dist/vue.esm-bundler.js'
            },
            {
                find: '@',
                replacement: resolve(__dirname, './src')
            }
        ]
    },
    server: {
        port: 50000,
        proxy: {
            // 选项写法
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, '')
            },
            // Proxying websockets or socket.io
            '/socket.io': {
                target: 'ws://localhost:3000',
                ws: true
            }
        }
    }
})
