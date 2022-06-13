import { combineClasses, okOrEmpty } from '@/utils/common.util'
import { defineComponent, h, isVNode, PropType, ref, VNode } from 'vue'
import LeftArrowIcon from '~icons/bi/arrow-down-circle-fill'
import RightArrowIcon from '~icons/bi/arrow-right-circle-fill'

const Collapse = defineComponent({
    name: 'Collapse',
    props: {
        title: {
            validator(value: VNode | string) {
                return isVNode(value) || typeof value === 'string'
            },
            required: true
        },
        content: {
            validator(value: VNode | string) {
                return isVNode(value) || typeof value === 'string'
            },
            required: true
        },
        /**
         * title class
         * unfold class `peer-checked:xxx`
         * example:
         * `bg-secondary`
         * `['bg-secondary', 'peer-checked:bg-primary', 'peer-checked:bg-accent']`
         */
        titleClass: {
            type: [String, () => Array<string>()],
            required: false
        },
        /**
         * content class
         * unfold class `peer-checked:xxx`
         * `bg-secondary`
         * `['bg-secondary', 'peer-checked:bg-primary', 'peer-checked:bg-accent']`
         */
        contentClass: {
            type: [String, () => Array<string>()],
            required: false
        },
        arrow: {
            type: Boolean,
            required: false,
            default: true
        },
        onChange: {
            type: Function as PropType<(e: boolean) => void>,
            required: false
        }
    },
    setup(props) {
        const input = ref(false)
        return () => (
            <div class="collapse">
                <input
                    type="checkbox"
                    value={input.value}
                    onChange={() => {
                        input.value = !input.value
                        props.onChange?.(input.value)
                    }}
                    class="peer"
                />
                <div
                    class={`collapse-title rounded-lg bg-base-100 text-base-content peer-checked:bg-accent peer-checked:text-accent-content peer-checked:rounded-t-lg peer-checked:rounded-b-none shadow-md
                    ${combineClasses(props.titleClass)}`}
                >
                    <div class="flex items-center space-x-4">
                        {props.arrow && input.value ? <LeftArrowIcon /> : <RightArrowIcon />}
                        <div class="flex-1">{isVNode(props.title) ? h(props.title) : props.title}</div>
                    </div>
                </div>
                {okOrEmpty(
                    !!props.content,
                    <div
                        class={`collapse-content bg-base-100 text-primary-content peer-checked:text-accent-content shadow-lg rounded-b-lg  ${combineClasses(
                            props.contentClass
                        )}`}
                    >
                        {isVNode(props.content) ? h(props.content) : props.content}
                    </div>
                )}
            </div>
        )
    }
})

export default Collapse
