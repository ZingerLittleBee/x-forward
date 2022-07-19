import { defineComponent, inject, ref, watchEffect } from 'vue'
import { FormStore } from '@/components/form/formStore'
import { STORE } from '../index.vue'
const Field = defineComponent({
    name: 'Field',
    props: {
        name: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: false
        }
    },
    setup({ label = '', name }, { slots }) {
        const store = inject<FormStore>(STORE)
        const value = ref(store?.get(name))
        const error = ref(store?.error(name))

        const onChange = (event: Event) => {
            const target = event.target as HTMLInputElement
            if (target.type === 'checkbox') {
                store?.set(name, target.checked)
                return
            }
            store?.set(name, target.value)
        }

        watchEffect(onInvalidate => {
            onInvalidate(() => {
                store?.subscribe((n: string) => {
                    if (n === name || n === '*') {
                        value.value = store?.get(name)
                        error.value = store?.error(name)
                    }
                })
            })
        })
        const defaultSlot = slots.default?.()?.[0]
        const childProps = { value: value.value, onChange, ...{ ...defaultSlot?.props } }

        return () => (
            <div>
                <label>{label ? label : name}</label>
                <div>
                    <div>{[{ ...defaultSlot, ...{ props: childProps } }]}</div>
                    {error.value ? <div>{error.value}</div> : ''}
                </div>
            </div>
        )
    }
})

export default Field
