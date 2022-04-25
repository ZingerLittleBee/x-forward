import UpstreamModel from '@/components/UpstreamModel/index'
import StreamForm from '@/pages/Stream/components/StreamForm'
import {
    StreamControllerDelete,
    StreamControllerGetStream,
    StreamControllerRestart,
    StreamControllerUpdateAllState,
    StreamControllerUpdateStateById,
    StreamControllerUpdateUpstreamIdById
} from '@/services/view/stream'
import { UpstreamControllerFindAll, UpstreamControllerUpdate } from '@/services/view/upstream'
import { turnState2Boolean } from '@/utils/enumUtils'
import { getKeyByValue } from '@/utils/objectUtil'
import { state2Boolean } from '@/utils/statusUtils'
import {
    CloseCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    IssuesCloseOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined,
    PlusCircleOutlined
} from '@ant-design/icons'
import ProCard from '@ant-design/pro-card'
import { StateEnum } from '@forwardx/shared'
import { useUpdateEffect } from 'ahooks'
import { Badge, Button, Form, message, Popconfirm, Result, Space, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { useModel, useRequest } from 'umi'
import { inspect } from 'util'
import styles from './index.less'
import StreamContent from '@/pages/Stream/components/StreamContent'
import BatchAction, { DropDownMenu } from '@/pages/Stream/components/BatchAction'

export type serverType = { remoteHost: string; remotePort: number }

export default () => {
    const { initialState } = useModel('@@initialState')
    const [curClientId, setCurClientId] = useState(initialState?.curClientId ? initialState?.curClientId : '')

    useUpdateEffect(() => {
        setCurClientId(initialState?.curClientId ? initialState?.curClientId : '')
    }, [initialState?.curClientId])

    useUpdateEffect(() => {
        streamRefresh()
        upstreamRefresh()
    }, [curClientId])

    const {
        loading: upstreamLoading,
        data: upstreamData,
        refresh: upstreamRefresh
    } = useRequest(() => UpstreamControllerFindAll({ clientId: curClientId }))
    const {
        loading: streamLoading,
        data: streamData,
        refresh: streamRefresh
    } = useRequest(() => StreamControllerGetStream({ clientId: curClientId }))

    const { run: streamDeleteRun } = useRequest((id: string) => StreamControllerDelete({ id }), {
        manual: true
    })

    const upstreamNameSelectEnum: Record<string, string> = {}

    upstreamData?.forEach(u => {
        const { id, name } = u
        if (id && name) upstreamNameSelectEnum[id] = name
    })

    const [currStreamData, setCurrStreamData] = useState<API.StreamVo>()

    const [form] = Form.useForm()

    // get [{ upstreamHost, upstreamPort }] by upstreamId
    const getServersFromUpstream = (
        upstreamId: string | undefined,
        upstreamData: API.UpstreamVo[] | undefined
    ): serverType[] => {
        const servers = upstreamData?.find(u => u.id === upstreamId)?.server
        if (servers) {
            return servers.map(s => ({
                remoteHost: s.upstreamHost,
                remotePort: s.upstreamPort
            }))
        }
        return []
    }

    const [servers, setServers] = useState<serverType[]>([])

    // handle upstream select change event
    const onUpstreamIdChange = (upstreamId: string | undefined) => {
        if (upstreamId) {
            const newServers = getServersFromUpstream(upstreamId, upstreamData)
            setServers(newServers)
            updateServerFieldValue(newServers)
        } else {
            setServers([])
        }
        form?.setFieldsValue({
            name: upstreamId ? upstreamData?.find(u => u.id === upstreamId)?.name : undefined
        })
    }

    // update upstream field when upstream select changed
    const updateServerFieldValue = (newServers: serverType[]) => {
        const remoteObj: Record<string, string | number> = {}
        newServers?.forEach(({ remoteHost, remotePort }, index) => {
            const currIndex = index + 1
            remoteObj[`remoteHost_${currIndex}`] = remoteHost
            remoteObj[`remotePort_${currIndex}`] = remotePort
        })
        if (Object.keys(remoteObj).length !== 0) {
            form?.setFieldsValue({
                ...remoteObj
            })
        }
        form?.setFieldsValue({
            ...currStreamData,
            state: state2Boolean(currStreamData?.state)
        })
    }

    useUpdateEffect(() => {
        form?.setFieldsValue({
            ...currStreamData,
            state: turnState2Boolean(currStreamData?.state)
        })
        onUpstreamIdChange(currStreamData?.upstreamId)
    }, [currStreamData])

    const [currUpstream, setCurrUpstream] = useState<API.UpstreamVo | undefined>()

    const [id, setId] = useState<string>()

    const [upstreamVisible, setUpstreamVisible] = useState(false)

    const streamModuleForm = (trigger: JSX.Element) => {
        return (
            <StreamForm
                form={form}
                curClientId={curClientId}
                currStreamData={currStreamData}
                servers={servers}
                upstreamNameSelectEnum={upstreamNameSelectEnum}
                trigger={trigger}
                streamRefresh={() => streamRefresh()}
                onUpstreamIdChange={onUpstreamIdChange}
                onVisibleChange={(visible: boolean) => {
                    if (!visible) {
                        setCurrStreamData(undefined)
                        setServers([])
                        form?.resetFields()
                    } else {
                        onUpstreamIdChange(currStreamData?.upstreamId)
                    }
                }}
            />
        )
    }

    const [cardLoading, setCardLoading] = useState<boolean[]>()

    useEffect(() => {
        setCardLoading(new Array(streamData?.length).fill(false))
    }, [streamData])

    const [applyAllServer, setApplyAllServer] = useState(false)

    const getCurClientTag = (): string =>
        initialState?.curClient?.domain ? initialState?.curClient?.domain : initialState?.curClient?.ip || 'Unknown'

    const menus: DropDownMenu[] = [
        {
            type: '重启',
            label: '全部重启',
            icon: <IssuesCloseOutlined style={{ fontSize: 20, color: '#345995' }} />,
            onOk: () => {
                applyAllServer ? StreamControllerRestart({}) : StreamControllerRestart({ clientId: curClientId })
            }
        },
        {
            type: '停止',
            label: '全部停止',
            icon: <PauseCircleOutlined style={{ fontSize: 20, color: '#fcae63' }} />,
            onOk: () =>
                applyAllServer
                    ? StreamControllerUpdateAllState({ state: StateEnum.Disable })
                    : StreamControllerUpdateAllState({ state: StateEnum.Disable, clientId: curClientId })
        },
        {
            type: '开始',
            label: '全部开始',
            icon: <PlayCircleOutlined style={{ fontSize: 20, color: '#acce16' }} />,
            onOk: () =>
                applyAllServer
                    ? StreamControllerUpdateAllState({ state: StateEnum.Able })
                    : StreamControllerUpdateAllState({ state: StateEnum.Able, clientId: curClientId })
        },
        {
            type: '删除',
            label: '全部删除',
            icon: <CloseCircleOutlined style={{ fontSize: 20, color: 'red' }} />,
            onOk: () => console.log('OK')
        }
    ]

    // @ts-ignore
    // https://github.com/ant-design/pro-components/issues/2553
    Badge.Ribbon.isProCard = true
    return (
        <Spin spinning={!!streamLoading || !!upstreamLoading}>
            <ProCard
                gutter={[16, 16]}
                title="转发规则"
                headStyle={{ paddingTop: 0 }}
                extra={
                    <Space>
                        {streamModuleForm(
                            <Button type="primary" icon={<PlusCircleOutlined />}>
                                添加规则
                            </Button>
                        )}
                        <BatchAction
                            menus={menus}
                            curClientTag={getCurClientTag()}
                            onCheckChange={checked => setApplyAllServer(checked)}
                            onCancel={() => setApplyAllServer(false)}
                        />
                    </Space>
                }
                wrap
                ghost
            >
                {streamData && streamData.length !== 0 ? (
                    streamData?.map((d, index) => (
                        <Badge.Ribbon
                            key={d?.id}
                            placement="end"
                            text="100ms"
                            color={''}
                            // @ts-ignore
                            // https://github.com/ant-design/pro-components/issues/2553
                            colSpan={{ xs: 24, sm: 12, md: 12, lg: 8, xl: 6, xxl: 4 }}
                        >
                            <Spin spinning={cardLoading?.[index]}>
                                <ProCard
                                    hoverable
                                    bordered
                                    bodyStyle={{ paddingBottom: 0 }}
                                    className={styles.checked}
                                    onDoubleClick={() => console.log('db')}
                                    actions={[
                                        <Popconfirm
                                            title="确定删除?"
                                            onConfirm={async () => {
                                                if (d.id) {
                                                    try {
                                                        const data = await streamDeleteRun(d.id)
                                                        if (data && data > 0) {
                                                            streamRefresh()
                                                        }
                                                    } catch (e: unknown) {
                                                        message.error(`规则删除失败, ${inspect(e as string)}`)
                                                    }
                                                }
                                            }}
                                        >
                                            <DeleteOutlined key="delete" />
                                        </Popconfirm>,
                                        streamModuleForm(
                                            <EditOutlined
                                                key="edit"
                                                onClick={() => {
                                                    setCurrStreamData(d)
                                                    setCurrUpstream(upstreamData?.find(u => u.id === currUpstream?.id))
                                                }}
                                            />
                                        ),
                                        <div
                                            onClick={async () => {
                                                // update card loading status
                                                setCardLoading(cardLoading?.map((c, i) => (i === index ? true : c)))
                                                if (d.id) {
                                                    try {
                                                        await StreamControllerUpdateStateById(
                                                            { id: d.id },
                                                            { state: d.state ? StateEnum.Able : StateEnum.Disable }
                                                        )
                                                    } catch (e) {
                                                        message.error(`操作失败: ${e}`)
                                                    }
                                                    setCardLoading(
                                                        cardLoading?.map((c, i) => (i === index ? false : c))
                                                    )
                                                    streamRefresh()
                                                }
                                            }}
                                        >
                                            {d?.state ? (
                                                <PlayCircleOutlined key="Play" />
                                            ) : (
                                                <PauseCircleOutlined key="Pause" />
                                            )}
                                        </div>
                                    ]}
                                    key={d.id}
                                >
                                    <StreamContent
                                        dataSource={d}
                                        getUpstreamById={upstreamId => upstreamData?.find(u => u.id === upstreamId)}
                                        onUpstreamClick={(streamId, upstreamId) => {
                                            setId(streamId)
                                            setUpstreamVisible(true)
                                            setCurrUpstream(upstreamData?.find(u => u.id === upstreamId))
                                        }}
                                    />
                                </ProCard>
                            </Spin>
                        </Badge.Ribbon>
                    ))
                ) : (
                    <Result
                        status="404"
                        title="空空如也"
                        subTitle="抱歉, 您还未创建转发规则, 点击按钮开始吧"
                        extra={streamModuleForm(
                            <Button type="primary" icon={<PlusCircleOutlined />}>
                                添加规则
                            </Button>
                        )}
                    />
                )}
            </ProCard>
            <UpstreamModel
                upstream={currUpstream}
                upstreamName={upstreamNameSelectEnum}
                visible={upstreamVisible}
                onUpstreamSelectChange={e => {
                    setCurrUpstream(upstreamData?.find(u => u.id === e))
                }}
                onClose={form => {
                    setUpstreamVisible(false)
                    setCurrUpstream(upstreamData?.find(u => u.id === currUpstream?.id))
                    form?.resetFields()
                }}
                onUpstreamSubmit={async e => {
                    const { name } = e
                    const selectUpstreamId = getKeyByValue(upstreamNameSelectEnum, name)
                    // remove upstream
                    if (id && (selectUpstreamId !== currUpstream?.id || (!selectUpstreamId && !currUpstream))) {
                        try {
                            await StreamControllerUpdateUpstreamIdById(
                                { id },
                                { data: { upstreamId: selectUpstreamId } }
                            )
                        } catch (error) {
                            message.error(`更新 stream 失败, ${inspect(error)}`)
                        }
                    }
                    // update upstream
                    if (id && selectUpstreamId) {
                        try {
                            await UpstreamControllerUpdate({
                                id: selectUpstreamId,
                                ...(e as API.UpdateUpstreamDto)
                            })
                        } catch (error) {
                            message.error(`更新 upstream 失败, ${inspect(error)}`)
                        }
                    }
                    setUpstreamVisible(false)
                    // may be can optimize
                    setTimeout(streamRefresh, 100)
                    setTimeout(upstreamRefresh, 100)
                }}
            />
        </Spin>
    )
}
