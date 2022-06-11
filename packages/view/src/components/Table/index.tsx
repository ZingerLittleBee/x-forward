import { appendParamOnClick, getTextFromVNode, okOrEmpty } from '@/utils/common.util'
import { isTrue } from '@forwardx/shared'
import { defineComponent, h, isVNode, PropType, ref, VNode, watchEffect } from 'vue'
import styles from './index.module.css'

export type TableColumn = {
    prop: number | string
    label?: string
    width?: number
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
            required: true
        },
        columns: {
            type: Object as PropType<TableProps['columns']>,
            required: true
        },
        selection: {
            type: Boolean,
            default: true
        },
        subRowAlign: {
            type: String as PropType<'left' | 'center' | 'right' | 'justify' | 'char' | undefined>,
            required: false,
            default: 'center'
        }
    },
    setup(props) {
        // show subrow or not
        const isSubrow = ref(new Array(props.data.length).fill(false))
        // checkbox status
        const isChecked = ref(new Array(props.data.length).fill(false))
        const isAllChecked = ref(false)

        watchEffect(() => {
            isAllChecked.value = isChecked.value.every(v => isTrue(v))
        })
        return () => (
            <div class="overflow-x-auto w-full border-2">
                <table class="table table-compact w-full">
                    <thead>
                        <tr>
                            {/* {selectionBlock(isAllChecked, e => (isChecked.value = isChecked.value.map(() => e)))} */}
                            {okOrEmpty(
                                props.selection,
                                <th>
                                    <label>
                                        <input
                                            type="checkbox"
                                            class="checkbox"
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
                            {props.columns.map(c => (
                                <th>{c.label ? c.label : c.prop}</th>
                            ))}
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
                                            props.selection,
                                            <th>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        class="checkbox"
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
                                        {props.columns.map(c => (
                                            <td>{isVNode(record[c.prop]) ? h(record[c.prop]) : record[c.prop]}</td>
                                        ))}
                                        {/* handle operation */}
                                        {okOrEmpty(
                                            record?.operation,
                                            record?.operation?.map((o: VNode) => {
                                                if (!isVNode(o)) return h(o)
                                                let rowData: Record<string | number, any> = {}
                                                Object.keys(record)
                                                    ?.filter(r => r !== 'operation')
                                                    ?.forEach(r => {
                                                        rowData[r] = record[r]
                                                    })
                                                let param = getTextFromVNode(rowData)
                                                // add param on click event
                                                return <th>{h(appendParamOnClick(o, param))}</th>
                                            })
                                        )}
                                    </tr>
                                    {/* subrow */}
                                    {okOrEmpty(
                                        isSubrow.value[i] && record.subRow,
                                        <tr class="hidden">
                                            <th colspan="100" align={props.subRowAlign}>
                                                {Array.isArray(record.subRow) ? (
                                                    record.subRow?.map(s => <p>{s}</p>)
                                                ) : typeof record.subRow === 'object' ? (
                                                    Array.isArray(record.subRow) ? (
                                                        record.subRow?.map(s => <p>{s}</p>)
                                                    ) : (
                                                        Object.keys(record.subRow).map(s => (
                                                            <p>
                                                                <span>{s}: </span>
                                                                <span>{record.subRow[s]}</span>
                                                            </p>
                                                        ))
                                                    )
                                                ) : (
                                                    <p>{record.subRow}</p>
                                                )}
                                            </th>
                                        </tr>
                                    )}
                                </>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
})

export default Table
