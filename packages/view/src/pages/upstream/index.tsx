import Table, { TableColumn } from '@/components/Table'
import { defineComponent, h } from 'vue'
const Upstream = defineComponent({
    name: 'Upstream',
    setup() {
        const data = [
            {
                name: (
                    <div class="flex items-center space-x-3">
                        <div>
                            <div class="font-bold">Hart Hagerty</div>
                            <div class="text-sm opacity-50">United States</div>
                        </div>
                    </div>
                ),
                job: (
                    <>
                        Zemlak, Daniel and Leannon
                        <br />
                        <span class="badge badge-ghost badge-sm">Desktop Support Technician</span>
                    </>
                ),
                color: h('div', 'Purple'),
                subRow: {
                    name: 'John Brown2',
                    job: 'Zemlak, Daniel and Leannon2',
                    color: 'Purple2'
                },
                operation: [
                    <div onClick={e => console.log('div click', e)}>
                        <span onClick={e => console.log('span click', e)}>
                            <button class="btn" onClick={e => console.log('btn click', e)}>
                                Click
                            </button>
                        </span>
                    </div>,
                    <div onClick={e => console.log('div click', e)}>
                        <span onClick={e => console.log('span click', e)}>
                            <button class="btn btn-ghost btn-xs" onClick={e => console.log('btn click', e)}>
                                Click
                            </button>
                        </span>
                    </div>
                ]
            },
            {
                name: 'Jim Green',
                job: 'Zemlak, Daniel and Leannon',
                color: 'Purple',
                subRow: ['John Brown2', 'Zemlak, Daniel and Leannon2', 'Purple2']
            },
            {
                name: 'Joe Black',
                job: 'Zemlak, Daniel and Leannon',
                color: 'Purple'
            }
        ]
        const columns: TableColumn[] = [
            {
                prop: 'name',
                label: '姓名',
                width: 200
            },
            {
                prop: 'job',
                label: 'JOB',
                width: 200
            },
            {
                prop: 'color',
                label: 'FAVORITE COLOR',
                width: 200
            }
        ]
        return () => (
            <div class="w-full flex p-4">
                <Table columns={columns} data={data} selection={{ color: 'primary' }} />
            </div>
        )
    }
})

export default Upstream
