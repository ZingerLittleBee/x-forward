import ProTable, { ProColumns } from '@ant-design/pro-table'
import { Button } from 'antd'
import { useRequest } from 'umi'
import { UpstreamControllerCreate, UpstreamControllerFindAll } from '@/services/x-forward-frontend/upstream'
import { StateEnum } from '@/enums/StatusEnum'
import { LoadBalancingEnum } from '@/enums/StreamEnum'
import { ServerEnum } from '@/enums/UpstreamEnum'
import UpstreamModel from '@/components/UpstreamModel'
import { PlusCircleOutlined } from '@ant-design/icons'

export type UpstreamListItem = API.UpstreamVo

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
        render: () => [<a key="editor">编辑</a>, <a key="delete">删除</a>]
    }
]

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

    const { loading: upstreamLoading, data: upstreamData } = useRequest(UpstreamControllerFindAll)

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
                    onUpstreamSubmit={(e: API.CreateUpstreamDto | API.UpdateUpstreamDto) => {
                        console.log('e', e)
                        addUpstream(e as API.CreateUpstreamDto)
                    }}
                    onUpstreamRest={() => null}
                />
            ]}
        />
    )
}

export default Upstream
