import UpstreamModel from '@/components/UpstreamModel'
import {
    UpstreamControllerCreate,
    UpstreamControllerFindAll,
    UpstreamControllerRemove,
    UpstreamControllerUpdate
} from '@/services/view/upstream'
import { PlusCircleOutlined } from '@ant-design/icons'
import ProTable, { ProColumns } from '@ant-design/pro-table'
import {
    CommonEnum,
    isDef,
    IsOrNotTipsEnum,
    LoadBalancingEnum,
    OperationEnum,
    ServerEnum,
    StateEnum,
    UpstreamEnum
} from '@x-forward/shared'
import { Badge, Button, message, Popconfirm } from 'antd'
import { useState } from 'react'
import { useModel, useRequest } from 'umi'
import { useUpdateEffect } from 'ahooks'

export type UpstreamListItem = API.UpstreamVo

const expandedRowRender = ({ server }: UpstreamListItem) => {
    console.log('server', server)
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
                {
                    title: ServerEnum.Backup,
                    dataIndex: 'backup',
                    ellipsis: true,
                    render: (_, { backup }) => {
                        if (isDef(backup)) return Boolean(backup) ? IsOrNotTipsEnum.True : IsOrNotTipsEnum.False
                        return CommonEnum.PlaceHolder
                    }
                },
                {
                    title: ServerEnum.Down,
                    dataIndex: 'down',
                    ellipsis: true,
                    render: (_, { down }) => {
                        if (isDef(down)) return Boolean(down) ? IsOrNotTipsEnum.True : IsOrNotTipsEnum.False
                        return CommonEnum.PlaceHolder
                    }
                }
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
    const { initialState } = useModel('@@initialState')
    const [curClientId, setCurClientId] = useState<string>(initialState?.curClientId ? initialState?.curClientId : '')

    useUpdateEffect(() => {
        setCurClientId(initialState?.curClientId ? initialState?.curClientId : '')
    }, [initialState?.curClientId])

    useUpdateEffect(() => {
        upstreamRefresh()
    }, [curClientId])

    const {
        loading: upstreamLoading,
        data: upstreamData,
        refresh: upstreamRefresh
    } = useRequest(() => UpstreamControllerFindAll({ clientId: curClientId }))

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
                            // handle 'backup' 'down' from boolean to 0 | 1
                            if (e?.server) {
                                e.server = e.server.map(s => {
                                    if (isDef(s?.backup)) {
                                        s.backup = Number(s.backup) as 0 | 1
                                    }
                                    if (isDef(s?.down)) {
                                        s.down = Number(s.down) as 0 | 1
                                    }
                                    return s
                                })
                            }
                            const res = await addUpstream({ clientId: curClientId, ...(e as API.CreateUpstreamDto) })
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
