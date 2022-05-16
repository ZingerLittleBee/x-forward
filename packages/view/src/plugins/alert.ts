import { App, createApp } from 'vue'
import Alert, { AlertProp } from '@/components/Alert/index'

export default {
    install: (app: App) => {
        const createAlert = (props: AlertProp) => {
            const instance = createApp(Alert, props).mount(document.createElement('div'))
            document.body.appendChild(instance.$el)
        }
        app.provide<(props: AlertProp) => void>('createAlert', createAlert)
    }
}
