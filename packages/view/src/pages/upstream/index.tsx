import Collapse from '@/components/Collapse'
import Table, { TableColumn } from '@/components/Table'
import { getAllUpstream } from '@/request'
import { capitalizeFirstLetter, okOrEmpty } from '@/utils/common.util'
import { ServerEnum } from '@forwardx/shared'
import { defineComponent, ref, watchEffect } from 'vue'
import useUpstreamData, { ServerColumns, UpstreamShowColumns } from './useUpstreamData'

const Upstream = defineComponent({
    name: 'Upstream',
    setup() {
        const { data: rawUpstreams } = getAllUpstream()
        const data = ref<any>([])

        const upstream = useUpstreamData(rawUpstreams)

        watchEffect(() => {
            if (upstream.value) {
                data.value = upstream.value?.map(u => ({
                    name: (
                        <div class="flex items-center space-x-3">
                            <div>
                                <div class="font-bold">{u.name}</div>
                                {/* <div class="text-sm opacity-50">United States</div> */}
                            </div>
                        </div>
                    ),
                    state: <span class="badge badge-ghost badge-sm">{u.state}</span>,
                    loadBalancing: u.loadBalancing,
                    upstreamCount: (
                        <span class={`badge ${u.serverLength > 0 ? 'badge-accent' : 'badge-ghost'}`}>
                            {u.serverLength > 0 ? u.serverLength : 0}
                        </span>
                    )
                }))
            }
        })
        const columns: TableColumn[] = [
            {
                prop: 'name',
                label: '上游名称',
                width: 200
            },
            {
                prop: 'state',
                label: '状态',
                width: 200
            },
            {
                prop: 'loadBalancing',
                label: '负载算法',
                width: 200
            },
            {
                prop: 'upstreamCount',
                label: '上游数量',
                width: 200
            },
            {
                prop: 'operation',
                fixed: true,
                label: [
                    <div onClick={e => console.log('div click', e)}>
                        <span onClick={e => console.log('span click', e)}>
                            <button
                                class="btn btn-primary btn-outline btn-sm"
                                onClick={e => console.log('btn click', e)}
                            >
                                Click
                            </button>
                        </span>
                    </div>,
                    <div onClick={e => console.log('div click', e)}>
                        <span onClick={e => console.log('span click', e)}>
                            <button
                                class="btn btn-secondary btn-outline btn-sm"
                                onClick={e => console.log('btn click', e)}
                            >
                                Click
                            </button>
                        </span>
                    </div>
                ],
                width: 170
            }
        ]
        return () =>
            upstream.value.map(d => (
                <Collapse
                    title={
                        <div class="grid grid-cols-5 items-center relative">
                            {UpstreamShowColumns.map(c => (
                                <span class="truncate">{d[c]}</span>
                            ))}
                        </div>
                    }
                    content={okOrEmpty(
                        !!d.server,
                        <div class="w-full flex pt-4">
                            <Table
                                columns={ServerColumns.map(sc => {
                                    return {
                                        prop: sc,
                                        label: ServerEnum[capitalizeFirstLetter(sc) as keyof typeof ServerEnum]
                                    }
                                })}
                                data={d.server}
                                selection={{ color: 'primary' }}
                            />
                        </div>
                    )}
                    class="pt-6 px-10"
                />
            ))
    }
})

export default Upstream
