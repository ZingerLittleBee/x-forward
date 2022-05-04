import { ModalForm, ProFormTextArea } from '@ant-design/pro-form'
import { message, Space, Typography } from 'antd'
import React from 'react'
import { batchAddTextRule } from '@/utils/ruleUtil'

const { Text } = Typography

type BatchAddProp = {
    title: string
    visible: boolean
    onVisibleChange: (visible: boolean) => void
    onFinish: (values: { rules: string }) => Promise<void>
}

const BatchAdd: React.FC<BatchAddProp> = ({ title, visible, onVisibleChange }) => {
    return (
        <ModalForm
            title={title}
            visible={visible}
            onFinish={async (value: { rules?: string }) => {
                console.log('value', value?.rules)
                message.success('提交成功')
                return true
            }}
            onVisibleChange={onVisibleChange}
        >
            <Typography.Title level={5} style={{ margin: 0 }}>
                支持格式
            </Typography.Title>
            <Space direction="vertical" size={2} className="my-2">
                <Text code>UpstreamName</Text>
                <Text code>LocalPort:UpstreamName</Text>
                <Text code>UpstreamHost:UpstreamPort</Text>
                <Text code>LocalPort:UpstreamHost:UpstreamPort</Text>
            </Space>
            <ProFormTextArea
                name="rules"
                rules={[batchAddTextRule()]}
                placeholder="请输入名称"
                fieldProps={{ autoSize: { minRows: 5 } }}
            />
            <div className="-mt-2">
                <Text type="secondary" className="text-xs">
                    LocalPort 省略将随机分配
                </Text>
            </div>
        </ModalForm>
    )
}

export default BatchAdd
