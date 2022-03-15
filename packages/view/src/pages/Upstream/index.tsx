import UpstreamModel from '@/components/UpstreamModel'
import {
    UpstreamControllerCreate,
    UpstreamControllerFindAll,
    UpstreamControllerRemove,
    UpstreamControllerUpdate
} from '@/services/view/upstream'
import { PlusCircleOutlined } from '@ant-design/icons'
import ProTable, { ProColumns } from '@ant-design/pro-table'
import { LoadBalancingEnum, OperationEnum, ServerEnum, StateEnum, UpstreamEnum } from '@x-forward/shared'
import { Badge, Button, message, Popconfirm } from 'antd'
import { useState } from 'react'
import { useRequest } from 'umi'

export type UpstreamListItem = API.UpstreamVo

const expandedRowRender = ({ server }: UpstreamListItem) => {
    return (
        <ProTable
            columns={[
                {
                    title: ServerEnum.UpstreamHost,
                    dataIndex: 'upstreamHost'
                },
                {
                    title: ServerEnum.UpstreamPort,
                    dataIndex: 'upstreamPort'
                },
                { title: ServerEnum.Weight, dataIndex: 'weight' },
                {
                    title: ServerEnum.MaxCons,
                    dataIndex: 'maxCons',
                    ellipsis: true
                },
                {
                    title: ServerEnum.MaxFails,
                    dataIndex: 'maxFails',
                    ellipsis: true
                },
                {
                    title: ServerEnum.FailTimeout,
                    dataIndex: 'failTimeout',
                    ellipsis: true
                },
                { title: ServerEnum.Backup, dataIndex: 'backup', ellipsis: true },
                { title: ServerEnum.Down, dataIndex: 'down', ellipsis: true }
            ]}
            headerTitle={false}
            search={false}
            options={false}
            dataSource={server?.map(s => ({ ...s, key: s.id }))}
            pagination={false}
            sticky={true}
        />
    )
}

const Upstream = () => {
    const {
        loading: upstreamLoading,
        data: upstreamData,
        refresh: upstreamRefresh
    } = useRequest(() => UpstreamControllerFindAll({}))

    const { run: addUpstream } = useRequest(
        (createUpstreamDto: API.CreateUpstreamDto) => UpstreamControllerCreate(createUpstreamDto),
        { manual: true, throwOnError: true }
    )

    const { run: updateUpstream } = useRequest(
        (updateUpstreamDto: API.UpdateUpstreamDto) => UpstreamControllerUpdate(updateUpstreamDto),
        { manual: true, throwOnError: true }
    )

    const { run: upstreamDeleteById } = useRequest((id: string) => UpstreamControllerRemove({ id }))

    const columns: ProColumns<UpstreamListItem>[] = [
        {
            title: UpstreamEnum.Name,
            key: 'upstreamName',
            dataIndex: 'name',
            render: _ => <a>{_}</a>
        },
        {
            title: UpstreamEnum.State,
            key: 'upstreamState',
            dataIndex: 'state',
            valueEnum: StateEnum
        },
        {
            title: UpstreamEnum.LoadBalancing,
            key: 'loadBalancing',
            dataIndex: 'loadBalancing',
            ellipsis: true,
            valueEnum: LoadBalancingEnum
        },
        {
            title: UpstreamEnum.ServerLength,
            key: 'serverLength',
            width: 80,
            ellipsis: true,
            render: (_, { server }) => {
                return (
                    <Badge.Ribbon
                        style={{ position: 'unset', textAlign: 'center' }}
                        placement="start"
                        text={server?.length ? server?.length : 0}
                        color={server?.length ? '' : 'pink'}
                    />
                )
            }
        },
        {
            title: UpstreamEnum.CreateTime,
            key: 'createTime',
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
            title: OperationEnum.Operation,
            key: 'option',
            width: 100,
            valueType: 'option',
            render: (_, entity) => [
                <UpstreamModel
                    key="upstreamEditor"
                    title={OperationEnum.Editor}
                    trigger={<a key="editor">{OperationEnum.Editor}</a>}
                    upstream={entity}
                    upstreamName={entity.name}
                    onUpstreamSubmit={async (e: API.UpdateUpstreamDto) => {
                        if (e?.id) {
                            try {
                                const res = await updateUpstream(e)
                                if (res?.id) {
                                    setExpandedRowKeys([...expandedRowKeys, res.id])
                                }
                            } catch (e) {
                                message.error(`更新 upstream 失败, ${e}`)
                                return
                            }
                            upstreamRefresh()
                        }
                    }}
                />,
                <Popconfirm
                    key="upstreamDelete"
                    title={`确定${OperationEnum.Delete}?`}
                    onConfirm={async () => {
                        if (entity.id) {
                            await upstreamDeleteById(entity.id)
                            upstreamRefresh()
                        }
                    }}
                >
                    <a key="delete">{OperationEnum.Delete}</a>
                </Popconfirm>
            ]
        }
    ]

    const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([])

    return (
        <ProTable<UpstreamListItem>
            loading={upstreamLoading}
            columns={columns}
            dataSource={upstreamData?.map(u => ({ ...u, key: u.id }))}
            rowKey="id"
            pagination={{
                showQuickJumper: true
            }}
            expandable={{
                expandedRowRender,
                expandedRowKeys,
                onExpand: (expanded, record) => {
                    if (expanded) {
                        if (record?.id) setExpandedRowKeys([...expandedRowKeys, record.id])
                    } else {
                        setExpandedRowKeys([...expandedRowKeys.filter(e => e !== record.id)])
                    }
                }
            }}
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
                        try {
                            const res = await addUpstream(e as API.CreateUpstreamDto)
                            if (res?.id) {
                                setExpandedRowKeys([...expandedRowKeys, res.id])
                            }
                        } catch (e) {
                            message.error(`添加 upstream 失败, ${e}`)
                            return
                        }
                        upstreamRefresh()
                    }}
                />
            ]}
        />
    )
}

export default Upstream
