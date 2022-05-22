import { defineComponent, PropType } from 'vue'

type OnChange = (checked: boolean) => void

const Toggle = defineComponent({
    props: {
        value: {
            type: Boolean,
            default: () => true
        },
        onChange: {
            type: Object as PropType<OnChange>,
            required: true
        }
    },
    setup(props) {
        return () => (
            <div>
                <input
                    type="checkbox"
                    class="toggle"
                    checked={props.value}
                    onChange={e => props.onChange((e.target as HTMLInputElement).checked)}
                />
            </div>
        )
    }
})

export default Toggle
