import ProCard from '@ant-design/pro-card'
import { DeleteOutlined, EditOutlined, PauseCircleOutlined, PlayCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { loadBalancingEnum, StreamItemEnum, StreamStatusEnum } from '@/enums/StreamEnum'
import ProDescriptions from '@ant-design/pro-descriptions'
import { Button, message, Result, Tag } from 'antd'
import { getAllStream } from '@/services/stream'
import { useRequest } from 'ahooks'
import ProForm, { ModalForm, ProFormInstance, ProFormSelect, ProFormSwitch, ProFormText, ProFormTextArea } from '@ant-design/pro-form'
import { useRef, useState } from 'react'

export default () => {
    // 请求转发规则接口
    const { loading, data } = useRequest(getAllStream)

    const dataSource = data?.data

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

    return (
        <>
            <ProCard gutter={[16, 16]} wrap ghost loading={loading}>
                {dataSource?.length !== 0 ? (
                    dataSource?.map(d => (
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
                                title={d.title}
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
                                        title: StreamItemEnum.state,
                                        dataIndex: 'state',
                                        valueEnum: StreamStatusEnum,
                                        render: (_, entity) => {
                                            return entity.state ? (
                                                <Tag icon={<PauseCircleOutlined />} color="#EF4444">
                                                    已停止
                                                </Tag>
                                            ) : (
                                                <Tag icon={<PlayCircleOutlined />} color="#34D399">
                                                    正在运行
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
                                        title: StreamItemEnum.createdTime,
                                        dataIndex: 'createdTime'
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
