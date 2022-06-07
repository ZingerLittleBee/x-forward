import { getNginxInfo } from '@/request/modules/env'
import { useClientStore } from '@/stores/client'
import { NginxConfig } from '@x-forward/app/libs/executor/src/interfaces/nginx-config.interface'
import { defineComponent, FunctionalComponent, h, onMounted, PropType, ref, SVGAttributes } from 'vue'

export type ListData = {
    key?: string
    label?: string
    value?: string
}

type ListProp = {
    title?: string
    icon?: FunctionalComponent<SVGAttributes>
    data: ListData[]
}

const List = defineComponent({
    props: {
        title: {
            type: String,
            required: false
        },
        icon: {
            type: Object as PropType<ListProp['icon']>,
            required: false
        },
        data: {
            type: Object as PropType<ListData[]>,
            required: true
        }
    },
    setup(props) {
        const clientStore = useClientStore()

        let nginxInfo = ref<NginxConfig>()

        onMounted(async () => {
            if (!clientStore.getCurrentClientId) {
                await clientStore.initClient()
            }
            if (clientStore.getCurrentClientId) {
                const { data } = await getNginxInfo(clientStore.getCurrentClientId)
                nginxInfo.value = data.value
            }
        })

        return () => (
            <div class="flex flex-col bg-base-100 space-y-2">
                {props.title && <div>{props.title}</div>}
                <div class="overflow-y-auto">
                    {props.data.map(d => {
                        return (
                            <div class="p-2">
                                <div class="flex items-center space-x-2">
                                    {props.icon && <span class="text-secondary">{h(props.icon)}</span>}
                                    <span class="text-sm">{d.key}</span>
                                    <span class="stat-title text-xs">{d.label}</span>
                                </div>
                                <div class="stat-desc italic whitespace-normal">{d.value}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
})

export default List
