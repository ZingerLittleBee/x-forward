import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import Icons from 'unplugin-icons/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
    plugins: [
        vue(),
        Icons({
            /* options */
        }),
        vueJsx({
            // options are passed on to @vue/babel-plugin-jsx
        })
    ],
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
    }
})
