import { AlertType, getIconSvg } from './icons'
import { defineComponent, onMounted, PropType, ref } from 'vue'

export type AlertProp = {
    message: string
    type: AlertType
}

const Alert = defineComponent({
    props: {
        type: {
            type: String as PropType<AlertType>,
            required: true
        },
        message: {
            type: [String, Number],
            required: true
        }
    },
    setup({ type, message }) {
        const visible = ref(true)
        onMounted(() => setTimeout(() => (visible.value = false), 3000))
        return () =>
            visible.value ? (
                <div class={`alert alert-${type} shadow-lg absolute top-8 left-0 right-0 w-1/2 m-auto z-50`}>
                    <div>
                        {getIconSvg(type)}
                        <span>{message}</span>
                    </div>
                    <div class="flex-none">
                        <button class="btn btn-xs btn-square" onClick={() => (visible.value = false)}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            ) : null
    }
})

export default Alert
