import UpstreamModel from '@/components/UpstreamModel/index'
import {
    StreamControllerCreateOne,
    StreamControllerDelete,
    StreamControllerGetStream,
    StreamControllerUpdateStreamById,
    StreamControllerUpdateUpstreamIdById
} from '@/services/view/stream'
import { UpstreamControllerFindAll, UpstreamControllerUpdate } from '@/services/view/upstream'
import { getEnumKeyByValue, turnState2Boolean } from '@/utils/enumUtils'
import { getKeyByValue } from '@/utils/objectUtil'
import { hostRule, portRule, requiredRule } from '@/utils/ruleUtil'
import { state2Boolean } from '@/utils/statusUtils'
import { utc2local } from '@/utils/timeUtil'
import {
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined,
    PlusCircleOutlined
} from '@ant-design/icons'
import ProCard from '@ant-design/pro-card'
import ProDescriptions from '@ant-design/pro-descriptions'
import type { ProFormInstance } from '@ant-design/pro-form'
import ProForm, { ModalForm, ProFormSelect, ProFormSwitch, ProFormText, ProFormTextArea } from '@ant-design/pro-form'
import { CommonEnum, StreamItemEnum, StreamStatusEnum, UpstreamEnum } from '@x-forward/shared'
import { useUpdateEffect } from 'ahooks'
import { Badge, Button, Dropdown, Form, Menu, message, Popconfirm, Result, Spin, Tag } from 'antd'
import Paragraph from 'antd/es/typography/Paragraph'
import { omit } from 'lodash-es'
import { useRef, useState } from 'react'
import { useModel, useRequest } from 'umi'
import { inspect } from 'util'

export default () => {
    const { initialState } = useModel('@@initialState')
    const [curClientId, setCurClientId] = useState<string>(initialState?.curClientId ? initialState?.curClientId : '')

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

    const { run: addStreamRun } = useRequest(
        (createStreamDto: API.CreateStreamDto) => StreamControllerCreateOne(createStreamDto),
        {
            manual: true
        }
    )

    const restFormRef = useRef<ProFormInstance>()

    const upstreamNameSelectEnum: Record<string, string> = {}

    upstreamData?.forEach(u => {
        const { id, name } = u
        if (id && name) upstreamNameSelectEnum[id] = name
    })

    const [currStreamData, setCurrStreamData] = useState<API.StreamVo>()

    const [form] = Form.useForm()

    useUpdateEffect(() => {
        form.setFieldsValue({
            ...currStreamData,
            state: turnState2Boolean(currStreamData?.state)
        })
        onUpstreamIdChange(currStreamData?.upstreamId)
    }, [currStreamData])

    type serverType = { remoteHost: string; remotePort: number }

    const [servers, setServers] = useState<serverType[]>([])

    // get [{ upstreamHost, upstreamPort }] by upstreamId
    const getServersFromUpstream = (upstreamId: string | undefined): serverType[] => {
        const servers = upstreamData?.find(u => u.id === upstreamId)?.server
        if (servers) {
            return servers.map(s => ({
                remoteHost: s.upstreamHost,
                remotePort: s.upstreamPort
            }))
        }
        return []
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
            form.setFieldsValue({
                ...remoteObj
            })
        }
        form.setFieldsValue({
            ...currStreamData,
            state: state2Boolean(currStreamData?.state)
        })
    }

    // handle upstream select change event
    const onUpstreamIdChange = (upstreamId: string | undefined) => {
        if (upstreamId) {
            const newServers = getServersFromUpstream(upstreamId)
            setServers(newServers)
            updateServerFieldValue(newServers)
        } else {
            setServers([])
        }
        form.setFieldsValue({
            name: upstreamId ? upstreamData?.find(u => u.id === upstreamId)?.name : undefined
        })
    }

    const findUpstreamById = (id: string | undefined): API.UpstreamVo | undefined => {
        return upstreamData?.find(u => u.id === id)
    }

    const remoteRuleServers = (servers: API.ServerEntity[] | undefined) => {
        return (
            <Menu>
                {servers?.map((s, index) => (
                    <Menu.Item key={`${s.id}_${index}`}>
                        <Tag color="processing">
                            <code>
                                <Paragraph
                                    style={{ marginBottom: 0 }}
                                    copyable={{ tooltips: false }}
                                >{`${s.upstreamHost}:${s.upstreamPort}`}</Paragraph>
                            </code>
                        </Tag>
                    </Menu.Item>
                ))}
            </Menu>
        )
    }

    const [currUpstream, setCurrUpstream] = useState<API.UpstreamVo | undefined>()

    const [id, setId] = useState<string>()

    const [upstreamVisible, setUpstreamVisible] = useState(false)

    const streamModuleForm = (trigger: JSX.Element) => (
        <ModalForm
            trigger={trigger}
            title={currStreamData?.id ? '修改转发规则' : '创建转发规则'}
            form={form}
            formRef={restFormRef}
            modalProps={{
                forceRender: true
            }}
            onVisibleChange={(visible: boolean) => {
                if (!visible) {
                    setCurrStreamData(undefined)
                    setServers([])
                    form.resetFields()
                } else {
                    onUpstreamIdChange(currStreamData?.upstreamId)
                }
            }}
            submitter={{
                searchConfig: {
                    resetText: '重置'
                },
                resetButtonProps: {
                    onClick: () => restFormRef.current?.resetFields()
                }
            }}
            onFinish={async v => {
                const upstreamId = getKeyByValue(upstreamNameSelectEnum, v.name)
                const values: API.StreamDto = {
                    ...omit(v, 'name'),
                    state: v.state ? 0 : 1,
                    upstreamId
                }
                // update if it has id
                if (currStreamData?.id) {
                    const { data } = await StreamControllerUpdateStreamById({ id: currStreamData.id }, values)
                    if (data && data > 0) {
                        message.success('提交成功')
                        return true
                    }
                } else {
                    // create if it doesn't have id
                    const createValue: Record<string, any> = {}
                    Object.keys(values).forEach(v => {
                        if (!v.includes('_')) {
                            createValue[v] = values[v]
                        }
                    })
                    const streamVo = await addStreamRun({
                        ...createValue,
                        upstreamId,
                        clientId: curClientId
                    })
                    if (streamVo?.id) {
                        streamRefresh()
                        message.success('创建成功')
                        return true
                    }
                }
                message.warn('提交失败')
                return false
            }}
        >
            <ProFormSelect
                name="name"
                label={UpstreamEnum.Name}
                valueEnum={upstreamNameSelectEnum}
                fieldProps={{
                    onChange(value) {
                        onUpstreamIdChange(value)
                    }
                }}
            />
            <ProFormText
                width="sm"
                name="transitPort"
                label={StreamItemEnum.TransitPort}
                rules={[requiredRule(StreamItemEnum.TransitPort), portRule()]}
                placeholder={`请输入${StreamItemEnum.TransitPort}`}
            />

            {servers.length !== 0 ? (
                servers?.map((s, index) => {
                    const currIndex = index + 1
                    return (
                        <ProForm.Group key={index}>
                            <ProFormText
                                disabled={true}
                                width="md"
                                name={`remoteHost_${currIndex}`}
                                label={`${StreamItemEnum.RemoteHost}_${currIndex}`}
                                rules={[requiredRule(StreamItemEnum.RemoteHost), hostRule()]}
                                placeholder={`请输入${StreamItemEnum.RemoteHost}`}
                            />
                            <ProFormText
                                disabled={true}
                                name={`remotePort_${currIndex}`}
                                label={`${StreamItemEnum.RemotePort}_${currIndex}`}
                                rules={[requiredRule(StreamItemEnum.RemotePort), portRule()]}
                                placeholder={`请输入${StreamItemEnum.RemotePort}`}
                            />
                        </ProForm.Group>
                    )
                })
            ) : (
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="remoteHost"
                        label={StreamItemEnum.RemoteHost}
                        rules={[requiredRule(StreamItemEnum.RemoteHost), hostRule()]}
                        placeholder={`请输入${StreamItemEnum.RemoteHost}`}
                    />
                    <ProFormText
                        name="remotePort"
                        label={StreamItemEnum.RemotePort}
                        rules={[requiredRule(StreamItemEnum.RemotePort), portRule()]}
                        placeholder={`请输入${StreamItemEnum.RemotePort}`}
                    />
                </ProForm.Group>
            )}
            <ProFormSwitch name="state" label="是否启用" />
            <ProFormTextArea
                name="comment"
                label={StreamItemEnum.Comment}
                placeholder={`请输入${StreamItemEnum.Comment}`}
            />
        </ModalForm>
    )

    // @ts-ignore
    // https://github.com/ant-design/pro-components/issues/2553
    Badge.Ribbon.isProCard = true
    return (
        <Spin spinning={!!streamLoading || !!upstreamLoading}>
            <ProCard
                gutter={[16, 16]}
                title="转发规则"
                headStyle={{ paddingTop: 0 }}
                extra={streamModuleForm(
                    <Button type="primary" icon={<PlusCircleOutlined />}>
                        添加规则
                    </Button>
                )}
                wrap
                ghost
            >
                {streamData && streamData.length !== 0 ? (
                    streamData?.map(d => {
                        return (
                            <Badge.Ribbon
                                placement="end"
                                text="100ms"
                                color={''}
                                // @ts-ignore
                                // https://github.com/ant-design/pro-components/issues/2553
                                colSpan={{ xs: 24, sm: 12, md: 12, lg: 8, xl: 6, xxl: 4 }}
                            >
                                <ProCard
                                    hoverable
                                    bordered
                                    bodyStyle={{ paddingBottom: 0 }}
                                    colSpan={{ xs: 24, sm: 12, md: 12, lg: 8, xl: 6, xxl: 4 }}
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
                                        <PlayCircleOutlined key="Play" />
                                    ]}
                                    key={d.id}
                                >
                                    <ProDescriptions
                                        // title={d.title}
                                        column={1}
                                        labelStyle={{ color: '#6B7280' }}
                                        contentStyle={{ fontWeight: 500 }}
                                        dataSource={d}
                                        columns={[
                                            // Standalone version is not needed for now
                                            // {
                                            //     title: StreamItemEnum.transitHost,
                                            //     dataIndex: 'transitHost'
                                            // },
                                            {
                                                title: StreamItemEnum.TransitPort,
                                                dataIndex: 'transitPort'
                                            },
                                            // render `${StreamItemEnum.remoteHost}: xxx`, if it doesn't have upstream
                                            // render `${StreamItemEnum.remoteRule}: xxx`, if it has upstream
                                            {
                                                render: (_, { upstreamId, remoteHost }) => {
                                                    return (
                                                        <div className="ant-descriptions-item-container">
                                                            <span
                                                                className="ant-descriptions-item-label"
                                                                style={{ color: 'rgb(107, 114, 128)' }}
                                                            >
                                                                {upstreamId
                                                                    ? StreamItemEnum.RemoteRule
                                                                    : StreamItemEnum.RemoteHost}
                                                            </span>
                                                            <span
                                                                className="ant-descriptions-item-content"
                                                                style={{ fontWeight: 500 }}
                                                            >
                                                                {upstreamId ? (
                                                                    <Dropdown
                                                                        arrow
                                                                        trigger={['hover', 'click']}
                                                                        overlay={remoteRuleServers(
                                                                            findUpstreamById(upstreamId)?.server
                                                                        )}
                                                                        placement="bottom"
                                                                    >
                                                                        <Button size="small">
                                                                            Rules <DownOutlined />
                                                                        </Button>
                                                                    </Dropdown>
                                                                ) : (
                                                                    remoteHost
                                                                )}
                                                            </span>
                                                        </div>
                                                    )
                                                }
                                            },
                                            // render `${StreamItemEnum.remotePort}: xxx`, if it doesn't have upstream
                                            // render `${StreamItemEnum.loadBalancing}: xxx`, if it has upstream
                                            {
                                                render: (_, { upstreamId, remotePort }) => {
                                                    return (
                                                        <div className="ant-descriptions-item-container">
                                                            <span
                                                                className="ant-descriptions-item-label"
                                                                style={{ color: 'rgb(107, 114, 128)' }}
                                                            >
                                                                {upstreamId
                                                                    ? StreamItemEnum.LoadBalancing
                                                                    : StreamItemEnum.RemotePort}
                                                            </span>
                                                            <span
                                                                className="ant-descriptions-item-content"
                                                                style={{ fontWeight: 500 }}
                                                            >
                                                                {upstreamId
                                                                    ? getEnumKeyByValue(
                                                                          upstreamData?.find(u => u.id === upstreamId)
                                                                              ?.loadBalancing
                                                                      )
                                                                    : remotePort}
                                                            </span>
                                                        </div>
                                                    )
                                                }
                                            },
                                            {
                                                title: StreamItemEnum.Upstream,
                                                render: (_, entity) => {
                                                    const { upstreamId, id } = entity
                                                    const upstream = upstreamData?.find(u => u.id === upstreamId)
                                                    return (
                                                        <span
                                                            onClick={() => {
                                                                setId(id)
                                                                setUpstreamVisible(true)
                                                                setCurrUpstream(upstream)
                                                            }}
                                                        >
                                                            {upstream?.name || CommonEnum.PlaceHolder}
                                                        </span>
                                                    )
                                                }
                                            },
                                            {
                                                title: StreamItemEnum.State,
                                                dataIndex: 'state',
                                                valueEnum: StreamStatusEnum,
                                                render: (_, entity) => {
                                                    return !entity.state ? (
                                                        <Tag icon={<PlayCircleOutlined />} color="#34D399">
                                                            正在运行
                                                        </Tag>
                                                    ) : (
                                                        <Tag icon={<PauseCircleOutlined />} color="#EF4444">
                                                            已停止
                                                        </Tag>
                                                    )
                                                }
                                            },
                                            {
                                                title: StreamItemEnum.CreateTime,
                                                renderText: (text, { createTime }) => {
                                                    return createTime ? utc2local(createTime) : CommonEnum.PlaceHolder
                                                }
                                            },
                                            {
                                                title: StreamItemEnum.Comment,
                                                dataIndex: 'comment'
                                            }
                                        ]}
                                    />
                                </ProCard>
                            </Badge.Ribbon>
                        )
                    })
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
                    form.resetFields()
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
