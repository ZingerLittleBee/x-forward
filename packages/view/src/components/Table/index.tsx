import { appendParamOnClick, getTextFromVNode, okOrEmpty, SimpleVNode } from '@/utils/common.util'
import { isTrue } from '@forwardx/shared'
import { isBoolean, isString } from 'lodash'
import { computed, defineComponent, h, isVNode, PropType, ref, VNode, watchEffect } from 'vue'
import styles from './index.module.css'
import { CheckboxStyle, computedCheckboxStyle } from './styleHelper'
import { handleSubRow } from './subRow'

export type TableColumn = {
    prop: number | string
    label?: string | VNode[]
    width?: number
    fixed?: boolean | 'left' | 'right'
}

type TableProps = {
    data: Record<string | number, any>[]
    columns: TableColumn[]
}

const Table = defineComponent({
    name: 'Table',
    props: {
        /**
         * value support number | string | VNode
         * if value is object, it will be converted to string
         *
         * `subrow` field is used to display sub row
         * subrow support number | string | VNode
         * if value is object, it will be converted to
         * <p>
         *  <span>{key}: </span><span>{value}</span>
         * </p>
         * if value is array, it will be converted to
         * <p>{value}</p>
         *
         * examples
         * - { name: 'zhangsan', job: 'engineer', color: 'red' }
         * - { name: 'zhangsan', job: 'engineer', color: 'red', subrow: { name: 'lisi', job: 'engineer', color: 'red' } }
         */
        data: {
            type: Object as PropType<TableProps['data']>,
            required: false
        },
        columns: {
            type: Object as PropType<TableProps['columns']>,
            required: true
        },
        fixHeader: {
            type: Boolean,
            required: false,
            default: true
        },
        /**
         * type: `[Object as PropType<CheckboxStyle>, Boolean]`
         * hover will get error `No overload matches this call`
         */
        selection: {
            type: [Object, Boolean],
            default: false
        },
        subRowAlign: {
            type: String as PropType<'left' | 'center' | 'right' | 'justify' | 'char' | undefined>,
            required: false,
            default: 'left'
        }
    },
    setup(props) {
        // show subrow or not
        const isSubrow = ref(new Array(props.data ? props.data.length : 0).fill(false))
        // checkbox status
        const isChecked = ref(new Array(props.data ? props.data.length : 0).fill(false))
        const isAllChecked = ref(false)
        watchEffect(() => {
            isSubrow.value = new Array(props.data ? props.data.length : 0).fill(false)
            isChecked.value = new Array(props.data ? props.data.length : 0).fill(false)
        })
        const columnNums = computed(() => {
            if (props.columns.length === 0) {
                return 0
            }
            const labelLength = props.columns[props.columns.length - 1]?.label?.length
            return labelLength ? props.columns.length + labelLength - 1 : props.columns.length
        })
        watchEffect(() => {
            isAllChecked.value = isChecked.value.every(v => isTrue(v))
        })
        return () => (
            <div class="overflow-auto">
                {okOrEmpty(
                    !!props.data,
                    <table class="table-fixed table table-compact w-full">
                        <thead>
                            <tr class={`${props.fixHeader ? 'sticky top-0 z-20' : ''}`}>
                                {okOrEmpty(
                                    !!props.selection,
                                    <th class="w-10">
                                        <label>
                                            <input
                                                type="checkbox"
                                                class={`checkbox
                                            ${okOrEmpty(
                                                !isBoolean(props.selection),
                                                computedCheckboxStyle(props.selection as CheckboxStyle)
                                            )}
                                             `}
                                                checked={isAllChecked.value}
                                                onChange={e =>
                                                    (isChecked.value = isChecked.value.map(
                                                        () => (e.target as HTMLInputElement).checked
                                                    ))
                                                }
                                            />
                                        </label>
                                    </th>
                                )}
                                {props.columns.map(c => {
                                    return (
                                        <th
                                            class={`${
                                                c.fixed ? (c.fixed === 'left' ? 'sticky left-0' : 'sticky right-0') : ''
                                            }`}
                                            style={c.width ? { width: `${c.width}px` } : {}}
                                        >
                                            {c.prop === 'operation' ? 'operation' : c.label ? c.label : c.prop}
                                        </th>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {props.data?.map((record, i) => {
                                return (
                                    <>
                                        <tr
                                            class={`hover ${okOrEmpty(isSubrow.value[i], styles.subrow)}`}
                                            onClick={e => {
                                                // checkbox and btn can not trigger subrow visibility
                                                if (
                                                    (e.target as HTMLInputElement).type === 'checkbox' ||
                                                    (e.target as HTMLButtonElement).tagName === 'BUTTON'
                                                )
                                                    return
                                                isSubrow.value[i] = !isSubrow.value[i]
                                            }}
                                        >
                                            {/* checkbox */}
                                            {okOrEmpty(
                                                !!props.selection,
                                                <th>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            class={`checkbox ${okOrEmpty(
                                                                !isBoolean(props.selection),
                                                                computedCheckboxStyle(props.selection as CheckboxStyle)
                                                            )}`}
                                                            checked={isChecked.value[i]}
                                                            onChange={e =>
                                                                (isChecked.value[i] = (
                                                                    e.target as HTMLInputElement
                                                                ).checked)
                                                            }
                                                        />
                                                    </label>
                                                </th>
                                            )}
                                            {props.columns.map(c => {
                                                // handle operation
                                                if (c.prop === 'operation') {
                                                    if (isString(c.label)) return <button class="btn">{c.prop}</button>
                                                    let param = getTextFromVNode(c.label as unknown as SimpleVNode)
                                                    if (Array.isArray(c.label)) {
                                                        return (
                                                            <th
                                                                class={`${
                                                                    c.fixed
                                                                        ? c.fixed === 'left'
                                                                            ? 'sticky left-0'
                                                                            : 'sticky right-0'
                                                                        : ''
                                                                }`}
                                                            >
                                                                <div class="flex space-x-2">
                                                                    {(c.label as unknown as VNode[]).map(l =>
                                                                        h(appendParamOnClick(l, param))
                                                                    )}
                                                                </div>
                                                            </th>
                                                        )
                                                    }
                                                    // add param on click event
                                                    return (
                                                        <th
                                                            class={`${
                                                                c.fixed
                                                                    ? c.fixed === 'left'
                                                                        ? 'sticky left-0'
                                                                        : 'sticky right-0'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {h(appendParamOnClick(c.label as unknown as VNode, param))}
                                                        </th>
                                                    )
                                                }
                                                return (
                                                    <td
                                                        class={`${
                                                            c.fixed
                                                                ? c.fixed === 'left'
                                                                    ? 'sticky left-0'
                                                                    : 'sticky right-0'
                                                                : ''
                                                        }`}
                                                    >
                                                        {isVNode(record[c.prop]) ? h(record[c.prop]) : record[c.prop]}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                        {/* subrow */}
                                        {okOrEmpty(
                                            isSubrow.value[i] && record.subRow,
                                            <tr class="hidden">
                                                <th colspan={columnNums.value} align={props.subRowAlign}>
                                                    {handleSubRow(record.subRow)}
                                                </th>
                                            </tr>
                                        )}
                                    </>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        )
    }
})

export default Table
