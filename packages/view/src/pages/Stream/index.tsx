import ProCard from '@ant-design/pro-card'
import { DeleteOutlined, EditOutlined, PauseCircleOutlined, PlayCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { loadBalancingEnum, StreamItemEnum, StreamStatusEnum } from '@/enums/StreamEnum'
import ProDescriptions from '@ant-design/pro-descriptions'
import { Button, message, Result, Tag } from 'antd'
import { useRequest } from 'umi'
import type { ProFormInstance } from '@ant-design/pro-form'
import ProForm, { ModalForm, ProFormSelect, ProFormSwitch, ProFormText, ProFormTextArea } from '@ant-design/pro-form'
import { useRef, useState } from 'react'
import { UpstreamControllerFindAll } from '@/services/x-forward-frontend/upstream'
import { StreamControllerGetAllStream } from '@/services/x-forward-frontend/stream'
import { utc2local } from '@/utils/timeUtil'
import { CommonEnum } from '@/enums/CommonEnum'
import Upstream from '@/pages/Stream/components/Upstream'

export default () => {
    const { loading: upstreamLoading, data: upstreamData } = useRequest(UpstreamControllerFindAll)
    const { loading: streamLoading, data: streamData } = useRequest(StreamControllerGetAllStream)

    const restFormRef = useRef<ProFormInstance>()
    const [modalVisible, setModalVisible] = useState<boolean>(false)

    // 将 loadBalancingEnum 组装成 [{ value: xxx, label: xxx }]
    const loadBalancingSelectProp = () => {
        return Object.keys(loadBalancingEnum)
            .filter((_, i) => loadBalancingEnum[i] !== undefined)
            .map(l => {
                return {
                    label: loadBalancingEnum[l],
                    value: l
                }
            })
    }

    const upstreamNameSelectEnum: Record<string, string> = {}

    upstreamData?.forEach(u => {
        const { id, name } = u
        if (id && name) upstreamNameSelectEnum[id] = name
    })

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
                                <EditOutlined onClick={() => setModalVisible(true)} key="edit" />,
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
                                            const { upstreamId } = entity
                                            const currUpstream = upstreamData?.find(u => u.id === upstreamId)
                                            return currUpstream ? <Upstream upstream={currUpstream} upstreamNameSelectEnum={upstreamNameSelectEnum} /> : '-'
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
                                        valueEnum: loadBalancingEnum
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
                title="添加转发规则"
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
                onFinish={async values => {
                    await new Promise(resolve => {
                        setTimeout(resolve, 200)
                        console.log(values)
                    })
                    message.success('提交成功')
                    return true
                }}
            >
                <ProFormText width="sm" name="transitPort" label={StreamItemEnum.transitPort} placeholder={`请输入${StreamItemEnum.transitPort}`} />
                <ProForm.Group>
                    <ProFormText width="md" name="remoteHost" label={StreamItemEnum.remoteHost} placeholder={`请输入${StreamItemEnum.remoteHost}`} />
                    <ProFormText name="remotePort" label={StreamItemEnum.remotePort} placeholder={`请输入${StreamItemEnum.remotePort}`} />
                </ProForm.Group>
                <ProFormSelect
                    options={loadBalancingSelectProp()}
                    width="sm"
                    name="loadBalancing"
                    label={StreamItemEnum.loadBalancing}
                    placeholder={`请选择${StreamItemEnum.loadBalancing}`}
                />
                <ProFormSwitch name="state" label="是否启用" />
                <ProFormTextArea name="comment" label={StreamItemEnum.comment} placeholder={`请输入${StreamItemEnum.comment}`} />
            </ModalForm>
        </>
    )
}
