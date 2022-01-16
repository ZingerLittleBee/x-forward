import { useEffect, useRef, useState } from 'react'
import ProCard from '@ant-design/pro-card'
import {
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined,
    PlusCircleOutlined
} from '@ant-design/icons'
import { StreamItemEnum, StreamStatusEnum } from '@/enums/StreamEnum'
import ProDescriptions from '@ant-design/pro-descriptions'
import { Button, Dropdown, Form, Menu, message, Popconfirm, Result, Tag } from 'antd'
import { useRequest } from 'umi'
import type { ProFormInstance } from '@ant-design/pro-form'
import ProForm, { ModalForm, ProFormSelect, ProFormSwitch, ProFormText, ProFormTextArea } from '@ant-design/pro-form'
import { UpstreamControllerFindAll, UpstreamControllerUpdate } from '@/services/x-forward-frontend/upstream'
import { utc2local } from '@/utils/timeUtil'
import { CommonEnum } from '@/enums/CommonEnum'
import UpstreamModel from '@/components/UpstreamModel/index'
import { getKeyByValue } from '@/utils/objectUtil'
import { getEnumKeyByValue, turnState2Boolean } from '@/utils/enumUtils'
import { hostRule, portRule, requiredRule } from '@/utils/ruleUtil'
import { state2Boolean } from '@/utils/statusUtils'
import { ServerEnum } from '@/enums/UpstreamEnum'
import { omit } from 'lodash-es'
import {
    StreamControllerCreateOne,
    StreamControllerDelete,
    StreamControllerGetAllStream,
    StreamControllerUpdateStreamById,
    StreamControllerUpdateUpstreamIdById
} from '@/services/x-forward-frontend/stream'
import Paragraph from 'antd/es/typography/Paragraph'

export default () => {
    const {
        loading: upstreamLoading,
        data: upstreamData,
        refresh: upstreamRefresh
    } = useRequest(UpstreamControllerFindAll)
    const {
        loading: streamLoading,
        data: streamData,
        refresh: streamRefresh
    } = useRequest(StreamControllerGetAllStream)

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
    const [modalVisible, setModalVisible] = useState<boolean>(false)

    const upstreamNameSelectEnum: Record<string, string> = {}

    upstreamData?.forEach(u => {
        const { id, name } = u
        if (id && name) upstreamNameSelectEnum[id] = name
    })

    const [currStreamData, setCurrStreamData] = useState<API.StreamVo>()

    const [form] = Form.useForm()

    useEffect(() => {
        form.setFieldsValue({
            ...currStreamData,
            state: turnState2Boolean(currStreamData?.state)
        })
    }, [form, currStreamData])

    type serverType = { remoteHost: string; remotePort: number }

    const [servers, setServers] = useState<serverType[]>([])

    // get [{ upstreamHost, upstreamPort }] by upstreamId
    const getServersFromUpstream = (upstreamId: string | undefined): serverType[] => {
        const servers = upstreamData?.find(u => u.id === upstreamId)?.server
        if (servers) {
            return servers.map(s => {
                return {
                    remoteHost: s.upstreamHost,
                    remotePort: s.upstreamPort
                }
            })
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
            name: upstreamData?.find(u => u.id === upstreamId)?.name
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

    return (
        <>
            <ProCard
                gutter={[16, 16]}
                title="转发规则"
                headStyle={{ paddingTop: 0 }}
                extra={
                    <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => setModalVisible(true)}>
                        添加规则
                    </Button>
                }
                wrap
                ghost
                loading={streamLoading || upstreamLoading}
            >
                {streamData && streamData.length !== 0 ? (
                    streamData?.map(d => (
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
                                                message.error(e as string)
                                            }
                                        }
                                    }}
                                >
                                    <DeleteOutlined key="delete" />
                                </Popconfirm>,
                                <EditOutlined
                                    key="edit"
                                    onClick={() => {
                                        setCurrStreamData(d)
                                        setModalVisible(true)
                                    }}
                                />,
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
                                        title: StreamItemEnum.transitPort,
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
                                                            ? StreamItemEnum.remoteRule
                                                            : StreamItemEnum.remoteHost}
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
                                                                placement="bottomCenter"
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
                                        render: (_, { upstreamId, loadBalancing, remotePort }) => {
                                            return (
                                                <div className="ant-descriptions-item-container">
                                                    <span
                                                        className="ant-descriptions-item-label"
                                                        style={{ color: 'rgb(107, 114, 128)' }}
                                                    >
                                                        {upstreamId
                                                            ? StreamItemEnum.loadBalancing
                                                            : StreamItemEnum.remotePort}
                                                    </span>
                                                    <span
                                                        className="ant-descriptions-item-content"
                                                        style={{ fontWeight: 500 }}
                                                    >
                                                        {upstreamId ? getEnumKeyByValue(loadBalancing) : remotePort}
                                                    </span>
                                                </div>
                                            )
                                        }
                                    },
                                    {
                                        title: StreamItemEnum.upstream,
                                        render: (_, entity) => {
                                            const { upstreamId, id } = entity
                                            return (() => {
                                                const [currUpstream, setCurrUpstream] = useState<
                                                    API.UpstreamVo | undefined
                                                >(upstreamData?.find(u => u.id === upstreamId))
                                                return (
                                                    <UpstreamModel
                                                        trigger={
                                                            <span>{currUpstream?.name || CommonEnum.PLACEHOLDER}</span>
                                                        }
                                                        upstream={currUpstream}
                                                        upstreamName={upstreamNameSelectEnum}
                                                        onUpstreamSelectChange={e => {
                                                            setCurrUpstream(upstreamData?.find(u => u.id === e))
                                                        }}
                                                        onClose={form => {
                                                            setCurrUpstream(
                                                                upstreamData?.find(u => u.id === upstreamId)
                                                            )
                                                            form.resetFields()
                                                        }}
                                                        onUpstreamSubmit={async e => {
                                                            const { name } = e
                                                            const selectUpstreamId = getKeyByValue(
                                                                upstreamNameSelectEnum,
                                                                name
                                                            )
                                                            if (id && selectUpstreamId) {
                                                                const { data } = await UpstreamControllerUpdate(
                                                                    {
                                                                        id: selectUpstreamId
                                                                    },
                                                                    e as API.UpdateUpstreamDto
                                                                )
                                                                data && data > 0
                                                                    ? message.success('upstream 更新成功')
                                                                    : message.error('upstream 更新失败')
                                                                if (selectUpstreamId !== upstreamId) {
                                                                    const { data } =
                                                                        await StreamControllerUpdateUpstreamIdById(
                                                                            { id },
                                                                            { data: { upstreamId: selectUpstreamId } }
                                                                        )
                                                                    if (!(data && data > 0)) {
                                                                        message.error('stream 更新失败')
                                                                    }
                                                                }
                                                            }
                                                            // may be can optimize
                                                            setTimeout(streamRefresh, 100)
                                                            setTimeout(upstreamRefresh, 100)
                                                        }}
                                                    />
                                                )
                                            })()
                                        }
                                    },
                                    {
                                        title: StreamItemEnum.state,
                                        dataIndex: 'state',
                                        valueEnum: StreamStatusEnum,
                                        render: (_, entity) => {
                                            return entity.state ? (
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
                                        title: StreamItemEnum.createTime,
                                        renderText: (text, { createTime }) => {
                                            return createTime ? utc2local(createTime) : CommonEnum.PLACEHOLDER
                                        }
                                    },
                                    {
                                        title: StreamItemEnum.comment,
                                        dataIndex: 'comment'
                                    }
                                ]}
                            />
                        </ProCard>
                    ))
                ) : (
                    <Result
                        status="404"
                        title="空空如也"
                        subTitle="抱歉, 您还未创建转发规则, 点击按钮开始吧"
                        extra={
                            <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => setModalVisible(true)}>
                                添加规则
                            </Button>
                        }
                    />
                )}
            </ProCard>
            <ModalForm
                title={currStreamData?.id ? '修改转发规则' : '创建转发规则'}
                form={form}
                formRef={restFormRef}
                visible={modalVisible}
                onVisibleChange={(visible: boolean) => {
                    setModalVisible(visible)
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
                        const streamVo = await addStreamRun({ ...createValue, upstreamId })
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
                    label={ServerEnum.UPSTREAM_NAME}
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
                    label={StreamItemEnum.transitPort}
                    rules={[requiredRule(StreamItemEnum.transitPort), portRule()]}
                    placeholder={`请输入${StreamItemEnum.transitPort}`}
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
                                    label={`${StreamItemEnum.remoteHost}_${currIndex}`}
                                    rules={[requiredRule(StreamItemEnum.remoteHost), hostRule()]}
                                    placeholder={`请输入${StreamItemEnum.remoteHost}`}
                                />
                                <ProFormText
                                    disabled={true}
                                    name={`remotePort_${currIndex}`}
                                    label={`${StreamItemEnum.remotePort}_${currIndex}`}
                                    rules={[requiredRule(StreamItemEnum.remotePort), portRule()]}
                                    placeholder={`请输入${StreamItemEnum.remotePort}`}
                                />
                            </ProForm.Group>
                        )
                    })
                ) : (
                    <ProForm.Group>
                        <ProFormText
                            width="md"
                            name="remoteHost"
                            label={StreamItemEnum.remoteHost}
                            rules={[requiredRule(StreamItemEnum.remoteHost), hostRule()]}
                            placeholder={`请输入${StreamItemEnum.remoteHost}`}
                        />
                        <ProFormText
                            name="remotePort"
                            label={StreamItemEnum.remotePort}
                            rules={[requiredRule(StreamItemEnum.remotePort), portRule()]}
                            placeholder={`请输入${StreamItemEnum.remotePort}`}
                        />
                    </ProForm.Group>
                )}

                <ProFormSwitch name="state" label="是否启用" initialValue={turnState2Boolean(currStreamData?.state)} />
                <ProFormTextArea
                    name="comment"
                    label={StreamItemEnum.comment}
                    placeholder={`请输入${StreamItemEnum.comment}`}
                />
            </ModalForm>
        </>
    )
}
