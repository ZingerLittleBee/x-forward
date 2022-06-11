import Table, { TableColumn } from '@/components/Table'
import { getAllUpstream } from '@/request'
import { defineComponent, ref, watchEffect } from 'vue'
const Upstream = defineComponent({
    name: 'Upstream',
    setup() {
        const { data: upstreams } = getAllUpstream()
        const data = ref<any>([])
        watchEffect(() => {
            console.log(upstreams.value)
            if (upstreams.value) {
                data.value = upstreams.value?.map(upstream => {
                    return {
                        name: (
                            <div class="flex items-center space-x-3">
                                <div>
                                    <div class="font-bold">{upstream.name}</div>
                                    {/* <div class="text-sm opacity-50">United States</div> */}
                                </div>
                            </div>
                        ),
                        state: <span class="badge badge-ghost badge-sm">{upstream.state}</span>,
                        loadBalancing: upstream.loadBalancing,
                        upstreamCount: <span class="badge badge-ghost badge-sm">{upstream.server?.length}</span>
                    }
                })
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
                label: [
                    <div onClick={e => console.log('div click', e)}>
                        <span onClick={e => console.log('span click', e)}>
                            <button class="btn btn-primary btn-sm" onClick={e => console.log('btn click', e)}>
                                Click
                            </button>
                        </span>
                    </div>,
                    <div onClick={e => console.log('div click', e)}>
                        <span onClick={e => console.log('span click', e)}>
                            <button class="btn btn-secondary btn-sm" onClick={e => console.log('btn click', e)}>
                                Click
                            </button>
                        </span>
                    </div>
                ],
                width: 50
            }
        ]
        return () => (
            <div class="w-full flex p-4">
                <Table columns={columns} data={data.value} selection={{ color: 'primary' }} />
            </div>
        )
    }
})

export default Upstream
