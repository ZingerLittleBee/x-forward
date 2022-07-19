import { defineComponent, FunctionalComponent, h, onMounted, PropType, ref, SVGAttributes } from 'vue'
import { textOverflowCheck } from '@/utils/common.util'

export type ColorType = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error' | 'neutral'

export type BtnFn = {
    message: string
    icon?: FunctionalComponent<SVGAttributes>
    type?: ColorType
    onClick: (id: string) => void
}

export type BtnGroup = {
    leftBtn: BtnFn
    centerBtn?: BtnFn
    rightBtn: BtnFn
}

export type Content = {
    index?: number
    key: string
    value: string
    type?: ColorType
}

const Card = defineComponent({
    props: {
        id: {
            type: String,
            required: true
        },
        group: {
            type: Object as PropType<Content[]>,
            required: true
        },
        btnGroup: {
            type: Object as PropType<BtnGroup>,
            required: false
        },
        width: {
            type: String
        }
    },
    setup(props) {
        const btnGroup = props.btnGroup
        const cardKey = ref<any[]>([])
        const cardValue = ref<any[]>([])
        const isKeyOverflow = ref<boolean[]>([])
        const isValueOverflow = ref<boolean[]>([])
        onMounted(() => {
            isKeyOverflow.value = cardKey.value.map(c => textOverflowCheck(c))
            isValueOverflow.value = cardValue.value.map(c => textOverflowCheck(c))
        })
        return () => (
            <div class={`card ${props.width ? props.width : 'w-72'} bg-base-100 shadow-xl overflow-visible`}>
                <div class="card-body p-4">
                    {props.group.map((g, index) => (
                        <p
                            key={g.index ? g.index : index}
                            class="prose grid grid-cols-3 gap-1 place-items-start justify-center items-center"
                        >
                            <div
                                class={`${isKeyOverflow.value[index] ? 'tooltip' : ''} col-span-1 grid`}
                                data-tip={g.key}
                            >
                                <span
                                    class="text-sm truncate"
                                    ref={el => {
                                        if (el) cardKey.value[index] = el
                                    }}
                                >
                                    {g.key}
                                    {g.key ? ':' : ''}
                                </span>
                            </div>
                            <div
                                class={`${isValueOverflow.value[index] ? 'tooltip' : ''} col-span-2 grid`}
                                data-tip={g.value}
                            >
                                <span
                                    class={`${g.type ? `badge badge-${g.type}` : ''} truncate`}
                                    ref={el => {
                                        if (el) cardValue.value[index] = el
                                    }}
                                >
                                    {g.value}
                                </span>
                            </div>
                        </p>
                    ))}
                </div>
                {btnGroup && (
                    <div class="flex justify-center w-full btn-group">
                        <button
                            class={`btn btn-${btnGroup.leftBtn?.type} flex-1 rounded-none rounded-bl-2xl space-x-1`}
                            onClick={() => btnGroup.leftBtn.onClick(props.id)}
                        >
                            {btnGroup.leftBtn.icon && h(btnGroup.leftBtn.icon)}
                            {btnGroup.leftBtn.message}
                        </button>
                        {btnGroup?.centerBtn && (
                            <button
                                class={`btn btn-${btnGroup?.centerBtn?.type} flex-1 space-x-1`}
                                onClick={() => btnGroup?.centerBtn?.onClick(props.id)}
                            >
                                {btnGroup.centerBtn.icon && h(btnGroup.centerBtn.icon)}
                                {btnGroup.centerBtn.message}
                            </button>
                        )}
                        <button
                            class={`btn btn-${btnGroup.rightBtn?.type} flex-1 rounded-none rounded-br-2xl space-x-1`}
                            onClick={() => btnGroup.leftBtn.onClick(props.id)}
                        >
                            {btnGroup.rightBtn.icon && h(btnGroup.rightBtn.icon)}
                            <span>{btnGroup.rightBtn.message}</span>
                        </button>
                    </div>
                )}
            </div>
        )
    }
})

export default Card
