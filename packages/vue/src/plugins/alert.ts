import { App, createApp, ref } from 'vue'
import Alert, { AlertProp } from '@/components/Alert/index'

// Usage
// const alert = inject<(props: Alert) => void>('$alert')
// alert?.({
//     message: 'Ok',
//     type: 'success'
// })

export type Alert = Omit<AlertProp, 'id' | 'onClose'>

export default {
    install: (app: App) => {
        const alerts = ref<AlertProp[]>([])
        const instance = createApp(Alert, {
            alerts: alerts.value
        }).mount(document.createElement('div'))
        document.body.appendChild(instance.$el)
        const addAlert = (props: Alert) => {
            const id = alerts.value.length
            alerts.value.push({
                id,
                ...props,
                onClose: id =>
                    alerts.value.splice(
                        alerts.value.findIndex(a => a.id === id),
                        1
                    )
            })
            setTimeout(
                () =>
                    alerts.value.splice(
                        alerts.value.findIndex(a => a.id === id),
                        1
                    ),
                5000
            )
        }
        app.provide<(props: Alert) => void>('$alert', addAlert)
        app.config.globalProperties.$alert = addAlert
    }
}
