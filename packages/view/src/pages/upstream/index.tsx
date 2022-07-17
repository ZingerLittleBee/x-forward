import Collapse from '@/components/Collapse'
import Table from '@/components/Table'
import { getAllUpstream } from '@/request'
import { capitalizeFirstLetter, okOrEmpty } from '@/utils/common.util'
import { ServerEnum } from '@forwardx/shared'
import { defineAsyncComponent, defineComponent, ref, watchEffect } from 'vue'
import useUpstreamData, { ServerColumns, UpstreamShowColumns } from './useUpstreamData'
import Form from './Form.vue'
import { FormStore } from '@/components/form/formStore'

const AsyncComp = defineAsyncComponent(() => import('@/components/Drawer/index.vue'))

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
        const model = ref(false)
        const show = ref(false)
        const store = ref()

        watchEffect(() => {
            if (!model.value) {
                setTimeout(() => (show.value = false), 100)
            }
        })

        const operation = {
            prop: 'operation',
            fixed: true,
            label: <button class="btn btn-primary btn-outline btn-sm">Edit</button>,
            onClick: e => {
                store.value = new FormStore(e)
                show.value = true
                setTimeout(() => (model.value = !model.value), 100)
            },
            // <button class="btn btn-secondary btn-outline btn-sm" onClick={e => console.log('Delete click', e)}>
            //     Delete
            // </button>
            width: 170
        }
        return () => (
            <>
                {upstream.value.map(d => (
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
                                    columns={[
                                        ...ServerColumns.map(sc => ({
                                            prop: sc,
                                            label: ServerEnum[capitalizeFirstLetter(sc) as keyof typeof ServerEnum]
                                        })),
                                        operation
                                    ]}
                                    data={d.server}
                                    selection={{ color: 'primary' }}
                                />
                            </div>
                        )}
                        class="pt-6 px-10"
                    />
                ))}
                {show.value && (
                    <AsyncComp v-model={model.value}>
                        <Form store={store.value} />
                    </AsyncComp>
                )}
            </>
        )
    }
})

export default Upstream
