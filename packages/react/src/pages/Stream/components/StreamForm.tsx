import { serverType } from '@/pages/Stream'
import { StreamControllerCreateOne, StreamControllerUpdateStream } from '@/services/view/stream'
import { getKeyByValue } from '@/utils/objectUtil'
import { hostRule, portRule, requiredRule } from '@/utils/ruleUtil'
import ProForm, {
    ModalForm,
    ProFormInstance,
    ProFormSelect,
    ProFormSwitch,
    ProFormText,
    ProFormTextArea
} from '@ant-design/pro-form'
import { StreamItemEnum, UpstreamEnum } from '@forwardx/shared'
import { FormInstance, message } from 'antd'
import { omit } from 'lodash-es'
import { useRef } from 'react'
import { useRequest } from 'umi'

export type StreamFormProp = {
    form: FormInstance<any>
    curClientId: string
    currStreamData?: API.StreamVo
    servers: serverType[]
    trigger: JSX.Element
    upstreamNameSelectEnum: Record<string, string>
    onUpstreamIdChange: (upstreamId: string | undefined) => void
    streamRefresh: () => void
    onVisibleChange: (visible: boolean) => void
}

const StreamForm = ({
    form,
    curClientId,
    currStreamData,
    servers,
    trigger,
    upstreamNameSelectEnum,
    onUpstreamIdChange,
    streamRefresh,
    onVisibleChange
}: StreamFormProp) => {
    const { run: addStreamRun } = useRequest(
        (createStreamDto: API.CreateStreamDto) => StreamControllerCreateOne(createStreamDto),
        {
            manual: true
        }
    )

    const restFormRef = useRef<ProFormInstance>()

    return (
        <ModalForm
            trigger={trigger}
            title={currStreamData?.id ? '修改转发规则' : '创建转发规则'}
            form={form}
            formRef={restFormRef}
            onVisibleChange={onVisibleChange}
            submitter={{
                searchConfig: {
                    resetText: '重置'
                },
                resetButtonProps: {
                    onClick: () => restFormRef.current?.resetFields()
                }
            }}
            onFinish={async (v: API.StreamDto & { name: string }) => {
                const upstreamId = getKeyByValue(upstreamNameSelectEnum, v.name)
                const values: API.StreamDto = {
                    ...omit(v, 'name'),
                    state: v.state ? 0 : 1,
                    transitPort: Number(v?.transitPort),
                    upstreamId
                }
                // update if it has id
                if (currStreamData?.id) {
                    const { data } = await StreamControllerUpdateStream({ id: currStreamData.id }, values)
                    if (data && data > 0) {
                        message.success('提交成功')
                        streamRefresh()
                        return true
                    }
                    try {
                        await StreamControllerUpdateStream({ id: currStreamData.id }, values)
                    } catch (e) {
                        message.error(`更新失败, ${e}`)
                        return false
                    }
                    message.success('提交成功')
                    streamRefresh()
                    return true
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
}

export default StreamForm
