import { okOrEmpty } from '@/utils/common.util'
import { defineComponent, h, isVNode, PropType, ref, VNode } from 'vue'
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
        const selectionBlock = okOrEmpty(
            props.selection,
            <th>
                <label>
                    <input type="checkbox" class="checkbox" />
                </label>
            </th>
        )
        const isSubrow = ref(new Array().fill(false))
        return () => (
            <div class="overflow-x-auto w-full border-2">
                <table class="table table-compact w-full">
                    <thead>
                        <tr>
                            {selectionBlock}
                            {props.columns.map(c => (
                                <th>{c.label ? c.label : c.prop}</th>
                            ))}
                            {okOrEmpty(!!props?.operationGroup?.length, <th></th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {props.data?.map((record, i) => {
                            return (
                                <>
                                    <tr
                                        class={`hover ${okOrEmpty(isSubrow.value[i], styles.subrow)}`}
                                        onClick={() => (isSubrow.value[i] = !isSubrow.value[i])}
                                    >
                                        {selectionBlock}
                                        {props.columns.map(c => (
                                            <td>{isVNode(record[c.prop]) ? h(record[c.prop]) : record[c.prop]}</td>
                                        ))}
                                        <th>
                                            {okOrEmpty(
                                                record.operation,
                                                record.operation?.map((o: VNode) => {
                                                    if (o?.props?.onClick) {
                                                        let click = o.props.onClick
                                                        o.props.onClick = function () {
                                                            return click(record)
                                                        }
                                                    }
                                                    return h(o)
                                                })
                                            )}
                                        </th>

                                        <th>
                                            <button class="btn btn-ghost btn-xs">details</button>
                                        </th>
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
