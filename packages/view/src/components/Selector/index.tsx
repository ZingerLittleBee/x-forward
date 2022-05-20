import { defineComponent, FunctionalComponent, h, PropType, ref, SVGAttributes, Transition } from 'vue'
import LessIcon from '~icons/ci/unfold-less'
import MoreIcon from '~icons/ci/unfold-more'
import './index.css'

type BadgeType =
    | 'outline'
    | 'lg'
    | 'md'
    | 'sm'
    | 'xs'
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'ghost'
    | 'info'
    | 'success'
    | 'warning'
    | 'error'

export type SelectItem = {
    id?: string
    icon?: FunctionalComponent<SVGAttributes>
    badge?: {
        type: BadgeType
        tips?: string
    }
    message: string
    onClick?: (id: string) => void
}

const getBadgeType = (type: BadgeType) => {
    let badgeType = ''
    switch (type) {
        case 'outline': {
            badgeType = 'badge-outline'
            break
        }
        case 'lg': {
            badgeType = 'badge-lg'
            break
        }
        case 'md': {
            badgeType = 'badge-md'
            break
        }
        case 'sm': {
            badgeType = 'badge-sm'
            break
        }
        case 'xs': {
            badgeType = 'badge-xs'
            break
        }
        case 'primary': {
            badgeType = 'badge-primary'
            break
        }
        case 'secondary': {
            badgeType = 'badge-secondary'
            break
        }
        case 'accent': {
            badgeType = 'badge-accent'
            break
        }
        case 'ghost': {
            badgeType = 'badge-ghost'
            break
        }
        case 'info': {
            badgeType = 'badge-info'
            break
        }
        case 'success': {
            badgeType = 'badge-success'
            break
        }
        case 'warning': {
            badgeType = 'badge-warning'
            break
        }
        case 'error': {
            badgeType = 'badge-error'
            break
        }
    }
    return badgeType
}

const Selector = defineComponent({
    props: {
        width: {
            type: [Number, String],
            required: false
        },
        list: {
            type: Object as PropType<SelectItem[]>,
            required: true
        },
        placeHolder: {
            type: String,
            default: 'Type here'
        }
    },
    setup(props) {
        const inputRef = ref<HTMLInputElement | null>(null)
        const focusStatus = ref(false)
        const itemVisible = ref(true)
        const handleFocus = () => {
            focusStatus.value = true
            itemVisible.value = true
        }
        const handleFocusout = () => (focusStatus.value = false)
        return () => (
            <div class={`dropdown ${focusStatus.value ? 'dropdown-open' : ''}`}>
                <div tabindex="0" class="rounded-full">
                    <label class="relative block">
                        <label class="absolute inset-y-0 right-0 items-center pr-2 cursor-pointer">
                            <Transition name="selector-fade">
                                {focusStatus.value ? (
                                    <MoreIcon
                                        class="fill-current w-6 h-full text-base-300"
                                        onClick={() => {
                                            itemVisible.value = false
                                            focusStatus.value = false
                                        }}
                                    />
                                ) : (
                                    <LessIcon
                                        class="fill-current w-6 h-full text-base-300"
                                        onClick={() => {
                                            itemVisible.value = true
                                            focusStatus.value = true
                                            inputRef.value?.focus()
                                        }}
                                    />
                                )}
                            </Transition>
                        </label>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder={props.placeHolder}
                            style={props.width ? { width: props.width } : ''}
                            class="w-72 pr-12 input input-bordered input-accent max-w-lg"
                            onFocus={handleFocus}
                            onFocusout={handleFocusout}
                        />
                    </label>
                </div>
                <ul
                    tabindex="0"
                    style={{
                        ...(itemVisible.value ? {} : { opacity: 0 }),
                        ...(props.width ? { width: props.width } : {})
                    }}
                    class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-72"
                    onClick={() => (itemVisible.value = false)}
                >
                    {props.list.map((l, index) => (
                        <li key={l.id ? l.id : String(index)} onClick={() => l.onClick?.(l.id ? l.id : String(index))}>
                            <a class="justify-between">
                                <span class="flex flex-row items-center gap-1">
                                    {l.icon ? h(l.icon) : ''}
                                    {l.message}
                                </span>
                                {l.badge ? (
                                    <span class={`badge ${getBadgeType(l.badge.type)}`}>{l.badge?.tips}</span>
                                ) : (
                                    ''
                                )}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
})
export default Selector
