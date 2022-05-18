import { defineComponent, FunctionalComponent, h, PropType, SVGAttributes } from 'vue'

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
        }
    },
    setup(props) {
        const btnGroup = props.btnGroup
        return () => (
            <div class="card w-72 bg-base-100 shadow-xl">
                <div class="card-body p-6">
                    {props.group.map((g, index) => (
                        <p key={g.index ? g.index : index} class="prose flex items-center place-content-between">
                            <span class="text-sm">{g.key}:</span>
                            <span class={`${g.type && `badge badge-${g.type}`}`}>{g.value}</span>
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
