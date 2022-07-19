import { AlertType, getIconSvg } from './icons'
import { defineComponent, PropType, TransitionGroup } from 'vue'
import './index.css'

export type AlertProp = {
    id: number
    message: string
    type: AlertType
    onClose: (id: number) => void
}

const alert = ({ id, message, type, onClose }: AlertProp) => (
    <div key={id} class={`alert alert-${type} shadow-lg mb-1.5`}>
        <div>
            {getIconSvg(type)}
            <span>{message}</span>
        </div>
        <div class="flex-none">
            <button class="btn btn-xs btn-square" onClick={() => onClose(id)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>
)

const Alert = defineComponent({
    props: {
        alerts: {
            type: Object as PropType<AlertProp[]>,
            required: false
        }
    },
    setup(props) {
        return () => {
            return (
                <div class="absolute top-8 left-0 right-0 w-1/2 m-auto z-50">
                    <div>
                        <TransitionGroup name="alert-fade">{props.alerts?.map(a => alert(a))}</TransitionGroup>
                    </div>
                </div>
            )
        }
    }
})

export default Alert
