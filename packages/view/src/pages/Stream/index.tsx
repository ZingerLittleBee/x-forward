import ProCard from '@ant-design/pro-card'
import {
    DeleteOutlined,
    EditOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined,
    PlusCircleOutlined
} from '@ant-design/icons'
import { LoadBalancingEnum, StreamItemEnum, StreamStatusEnum } from '@/enums/StreamEnum'
import ProDescriptions from '@ant-design/pro-descriptions'
import { Button, Form, message, Result, Tag } from 'antd'
import { useRequest } from 'umi'
import type { ProFormInstance } from '@ant-design/pro-form'
import ProForm, { ModalForm, ProFormSwitch, ProFormText, ProFormTextArea } from '@ant-design/pro-form'
import { useEffect, useRef, useState } from 'react'
import { UpstreamControllerFindAll } from '@/services/x-forward-frontend/upstream'
import {
    StreamControllerGetAllStream,
    StreamControllerUpdateStreamById,
    StreamControllerUpdateUpstreamIdById
} from '@/services/x-forward-frontend/stream'
import { utc2local } from '@/utils/timeUtil'
import { CommonEnum } from '@/enums/CommonEnum'
import Upstream from '@/pages/Stream/components/Upstream'
import { getKeyByValue } from '@/utils/objectUtil'
import { turnState2Boolean } from '@/utils/enumUtils'
import { requiredRuleUtil } from '@/utils/ruleUtil'

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

    const restFormRef = useRef<ProFormInstance>()
    const [modalVisible, setModalVisible] = useState<boolean>(false)

    const upstreamNameSelectEnum: Record<string, string> = {}

    upstreamData?.forEach(u => {
        const { id, name } = u
        if (id && name) upstreamNameSelectEnum[id] = name
    })

    const [currStreamData, setCurrStreamData] = useState<API.StreamEntity>()

    const [form] = Form.useForm()

    useEffect(() => {
        form.setFieldsValue({
            ...currStreamData,
            state: turnState2Boolean(currStreamData?.state)
        })
    }, [form, currStreamData])

    return (
        <>
            <ProCard gutter={[16, 16]} wrap ghost loading={streamLoading || upstreamLoading}>
                {streamData ? (
                    streamData?.map(d => (
                        <ProCard
                            hoverable
                            bordered
                            bodyStyle={{ paddingBottom: 0 }}
                            colSpan={{ xs: 24, sm: 12, md: 12, lg: 8, xl: 6, xxl: 6 }}
                            actions={[
                                <DeleteOutlined key="delete" />,
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
                                    {
                                        title: StreamItemEnum.transitHost,
                                        dataIndex: 'transitHost'
                                    },
                                    {
                                        title: StreamItemEnum.transitPort,
                                        dataIndex: 'transitPort'
                                    },
                                    {
                                        title: StreamItemEnum.remoteHost,
                                        dataIndex: 'remoteHost'
                                    },
                                    {
                                        title: StreamItemEnum.remotePort,
                                        dataIndex: 'remotePort'
                                    },
                                    {
                                        title: StreamItemEnum.upstream,
                                        render: (_, entity) => {
                                            const { upstreamId, id } = entity
                                            return (() => {
                                                const [currUpstream, setCurrUpstream] = useState(
                                                    upstreamData?.find(u => u.id === upstreamId)
                                                )
                                                return (
                                                    <Upstream
                                                        upstream={currUpstream}
                                                        upstreamNameSelectEnum={upstreamNameSelectEnum}
                                                        onUpstreamSelectChange={async e => {
                                                            setCurrUpstream(upstreamData?.find(u => u.id === e))
                                                        }}
                                                        onUpstreamRest={() =>
                                                            setCurrUpstream(
                                                                upstreamData?.find(u => u.id === upstreamId)
                                                            )
                                                        }
                                                        onUpstreamSubmit={async e => {
                                                            const { name } = e
                                                            const selectUpstreamId = getKeyByValue(
                                                                upstreamNameSelectEnum,
                                                                name
                                                            )
                                                            if (selectUpstreamId !== upstreamId) {
                                                                await StreamControllerUpdateUpstreamIdById(
                                                                    { id: id! },
                                                                    { data: { upstreamId: selectUpstreamId } }
                                                                )
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
                                        title: StreamItemEnum.loadBalancing,
                                        dataIndex: 'loadBalancing',
                                        valueEnum: LoadBalancingEnum
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
                            <Button type="primary" icon={<PlusCircleOutlined />}>
                                添加规则
                            </Button>
                        }
                    />
                )}
            </ProCard>
            <ModalForm
                title="修改转发规则"
                form={form}
                formRef={restFormRef}
                visible={modalVisible}
                onVisibleChange={setModalVisible}
                submitter={{
                    searchConfig: {
                        resetText: '重置'
                    },
                    resetButtonProps: {
                        onClick: () => restFormRef.current?.resetFields()
                    }
                }}
                onFinish={async v => {
                    const values: API.StreamDto = { ...v, state: Number(!v.state) }
                    console.log('values', values, currStreamData?.id)
                    if (currStreamData?.id) {
                        const { data } = await StreamControllerUpdateStreamById({ id: currStreamData.id }, values)
                        if (data && data > 0) {
                            message.success('提交成功')
                            return true
                        }
                    }
                    message.warn('提交失败')
                    return false
                }}
            >
                <ProFormText
                    width="sm"
                    name="transitPort"
                    label={StreamItemEnum.transitPort}
                    initialValue={currStreamData?.transitPort}
                    rules={requiredRuleUtil(StreamItemEnum.transitPort)}
                    placeholder={`请输入${StreamItemEnum.transitPort}`}
                />
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="remoteHost"
                        label={StreamItemEnum.remoteHost}
                        initialValue={currStreamData?.remoteHost}
                        placeholder={`请输入${StreamItemEnum.remoteHost}`}
                    />
                    <ProFormText
                        name="remotePort"
                        label={StreamItemEnum.remotePort}
                        initialValue={currStreamData?.remotePort}
                        placeholder={`请输入${StreamItemEnum.remotePort}`}
                    />
                </ProForm.Group>
                <ProFormSwitch name="state" label="是否启用" initialValue={turnState2Boolean(currStreamData?.state)} />
                <ProFormTextArea
                    name="comment"
                    label={StreamItemEnum.comment}
                    initialValue={currStreamData?.comment}
                    placeholder={`请输入${StreamItemEnum.comment}`}
                />
            </ModalForm>
        </>
    )
}
