import UpstreamModel from '@/components/UpstreamModel'
import { StateEnum } from '@/enums/StatusEnum'
import { ServerEnum } from '@/enums/UpstreamEnum'
import {
    UpstreamControllerCreate,
    UpstreamControllerFindAll,
    UpstreamControllerRemove
} from '@/services/x-forward-frontend/upstream'
import { PlusCircleOutlined } from '@ant-design/icons'
import ProTable, { ProColumns } from '@ant-design/pro-table'
import { LoadBalancingEnum } from '@x-forward/shared'
import { Button, Popconfirm } from 'antd'
import { useRequest } from 'umi'

export type UpstreamListItem = API.UpstreamVo

const expandedRowRender = ({ server }: UpstreamListItem) => {
    return (
        <ProTable
            rowKey="id"
            columns={[
                { title: ServerEnum.UPSTREAM_HOST, dataIndex: 'upstreamHost' },
                { title: ServerEnum.UPSTREAM_PORT, dataIndex: 'upstreamPort' },
                { title: ServerEnum.WEIGHT, dataIndex: 'weight' },
                { title: ServerEnum.MAX_CONN, dataIndex: 'maxCons', ellipsis: true },
                { title: ServerEnum.MAX_FAILS, dataIndex: 'maxFails', ellipsis: true },
                { title: ServerEnum.FAIL_TIMEOUT, dataIndex: 'failTimeout', ellipsis: true },
                { title: ServerEnum.BACKUP, dataIndex: 'backup', ellipsis: true },
                { title: ServerEnum.DOWN, dataIndex: 'down', ellipsis: true }
            ]}
            headerTitle={false}
            search={false}
            options={false}
            dataSource={server}
            pagination={false}
            sticky={true}
        />
    )
}

const Upstream = () => {
    const { run: addUpstream } = useRequest(
        (createUpstreamDto: API.CreateUpstreamDto) => UpstreamControllerCreate(createUpstreamDto),
        { manual: true }
    )

    const { run: upstreamDeleteById } = useRequest((id: string) => UpstreamControllerRemove({ id }))

    const columns: ProColumns<UpstreamListItem>[] = [
        {
            title: '上游名称',
            dataIndex: 'name',
            key: 'upstreamName',
            render: _ => <a>{_}</a>
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'upstreamState',
            valueEnum: StateEnum
        },
        {
            title: '负载算法',
            dataIndex: 'loadBalancing',
            ellipsis: true,
            valueEnum: LoadBalancingEnum
        },
        {
            title: '上游数量',
            key: 'serverLength',
            ellipsis: true,
            render: (_, { server }) => server?.length
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            ellipsis: true,
            sorter: (a, b) => {
                if (a?.createTime && b?.createTime) {
                    return new Date(a?.createTime).getTime() - new Date(b?.createTime).getTime()
                }
                return 0
            }
        },
        {
            title: '操作',
            key: 'option',
            valueType: 'option',
            render: (dom, entity) => [
                <UpstreamModel
                    key="upstreamEditor"
                    title="编辑上游"
                    trigger={<a key="editor">编辑</a>}
                    upstream={entity}
                    upstreamName={entity.name}
                    onUpstreamSubmit={(e: API.CreateUpstreamDto | API.UpdateUpstreamDto) => {
                        console.log('e', e)
                    }}
                />,
                <Popconfirm
                    key="upstreamDelete"
                    title="确定删除?"
                    onConfirm={async () => {
                        if (entity.id) {
                            await upstreamDeleteById(entity.id)
                            upstreamRefresh()
                        }
                    }}
                >
                    <a key="delete">删除</a>
                </Popconfirm>
            ]
        }
    ]

    const {
        loading: upstreamLoading,
        data: upstreamData,
        refresh: upstreamRefresh
    } = useRequest(UpstreamControllerFindAll)

    // useEffect(() => {
    //     upstreamRefresh()
    // })

    return (
        <ProTable<UpstreamListItem>
            loading={upstreamLoading}
            columns={columns}
            dataSource={upstreamData}
            rowKey="id"
            pagination={{
                showQuickJumper: true
            }}
            expandable={{ expandedRowRender }}
            search={false}
            dateFormatter="string"
            headerTitle="上游服务"
            options={false}
            toolBarRender={() => [
                <UpstreamModel
                    title="添加上游"
                    trigger={
                        <Button key="primary" type="primary" icon={<PlusCircleOutlined />}>
                            添加上游
                        </Button>
                    }
                    onUpstreamSubmit={async (e: API.CreateUpstreamDto | API.UpdateUpstreamDto) => {
                        await addUpstream(e as API.CreateUpstreamDto)
                        upstreamRefresh()
                    }}
                />
            ]}
        />
    )
}

export default Upstream
