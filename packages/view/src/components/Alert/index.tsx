import { AlertType, getIconSvg } from './icons'

type AlertProp = {
    visible: boolean
    message: string
    type: AlertType
    closable?: boolean
    onClose?: () => void
}

const closeBtn = (onClose?: () => void) => (
    <div class="flex-none">
        <button class="btn btn-xs btn-square" onClick={() => onClose?.()}>
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
)

const Alert = ({ visible, message, type, closable = true, onClose }: AlertProp) =>
    visible ? (
        <div class={`alert alert-${type} shadow-lg absolute top-8 left-0 right-0 w-1/2 m-auto z-50`}>
            <div>
                {getIconSvg(type)}
                <span>{message}</span>
            </div>
            {closable && closeBtn(onClose)}
        </div>
    ) : (
        ''
    )

export default Alert
