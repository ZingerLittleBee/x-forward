import React, { useEffect } from 'react'
import ProForm, {
    DrawerForm,
    ProFormDependency,
    ProFormDigit,
    ProFormList,
    ProFormSelect,
    ProFormSwitch,
    ProFormText
} from '@ant-design/pro-form'
import { Form } from 'antd'
import { ServerEnum, ServerTipsEnum } from '@/enums/UpstreamEnum'
import { requiredRuleUtil } from '@/utils/ruleUtil'
import './index.less'
import { getEnumKeyByValue, loadBalancingSelectProp } from '@/utils/enumUtils'
import { StreamItemEnum } from '@/enums/StreamEnum'
import { isString } from 'lodash'
import { isUndef } from '@/utils/commonUtils'

// const initialValues: DataSourceType = {
//     id: '123123',
//     /** 是否生效; 0: able, 1: disable */
//     state: 0,
//     createTime: 'cratetime',
//     /** 上游地址 */
//     upstreamHost: 'baidu.com',
//     /** 上游端口 */
//     upstreamPort: 1111,
//     /** 设置服务器的权重，默认情况下为 1 */
//     weight: 1,
//     /** 限制到被代理服务器的最大同时连接数（1.11.5）。默认值为零，表示没有限制。如果服务器组未驻留在共享内存中，则此限制在每个 worker 进程中均有效 */
//     maxCons: 5,
//     /** 设置在 fail_timeout 参数设置的时间内与服务器通信的失败尝试次数，以便认定服务器在 fail_timeout 参数设置的时间内不可用。默认情况下，失败尝试的次数设置为 1。零值将禁用尝试记录。在这里，当与服务器正在建立连接中，失败尝试将是一个错误或超时 */
//     maxFails: 5,
//     /** 在时间范围内与服务器通信的失败尝试达到指定次数，应将服务器视为不可用,默认情况下，该参数设置为 10 秒 */
//     failTimeout: '5s',
//     /** 将服务器标记为备用服务器。当主服务器不可用时，连接将传递到备用服务器; 该参数不能与 hash 和 random 负载均衡算法一起使用; 0: false, 1: true */
//     backup: 0,
//     /** 将服务器标记为永久不可用; 0: false, 1: true */
//     down: 0
// }

type UpstreamProps = {
    title?: string
    trigger: JSX.Element
    onUpstreamSubmit: (data: API.UpdateUpstreamDto | API.CreateUpstreamDto) => void
    onUpstreamRest: () => void
    upstream?: API.UpstreamVo | undefined
    upstreamName?: Record<string, string> | string
    onUpstreamSelectChange?: (id: string) => void
}

const UpstreamModel: React.FC<UpstreamProps> = ({
    title = '上游服务',
    trigger,
    upstream,
    upstreamName,
    onUpstreamSelectChange,
    onUpstreamSubmit,
    onUpstreamRest
}) => {
    const [form] = Form.useForm()
    useEffect(() => {
        form.setFieldsValue({
            name: upstream?.name,
            server: upstream?.server
        })
    }, [form, upstream])
    return (
        <DrawerForm
            title={title}
            form={form}
            trigger={trigger}
            onFinish={async (e: API.UpdateUpstreamDto) => {
                onUpstreamSubmit(e)
                return true
            }}
            drawerProps={{
                onClose() {
                    onUpstreamRest()
                    form.resetFields()
                }
            }}
        >
            {isString(upstreamName) || isUndef(upstreamName) ? (
                <ProFormText
                    name="name"
                    label={ServerEnum.UPSTREAM_NAME}
                    placeholder={`请输入${ServerEnum.UPSTREAM_NAME}`}
                />
            ) : (
                <ProFormSelect
                    name="name"
                    label={ServerEnum.UPSTREAM_NAME}
                    initialValue={upstream?.name}
                    valueEnum={upstreamName}
                    fieldProps={{
                        onChange(value) {
                            if (onUpstreamSelectChange) onUpstreamSelectChange(value)
                        }
                    }}
                />
            )}

            <ProFormSelect
                name="loadBalancing"
                label={ServerEnum.LOAD_BALANCING}
                options={loadBalancingSelectProp()}
                initialValue={getEnumKeyByValue(upstream?.loadBalancing)}
                placeholder={`请选择${StreamItemEnum.loadBalancing}`}
            />
            <ProFormDependency name={['name']} ignoreFormListField>
                {({ name }) => {
                    if (!name) return null
                    return (
                        <ProFormList
                            name={['server']}
                            initialValue={upstream?.server}
                            itemContainerRender={doms => {
                                return <ProForm.Group>{doms}</ProForm.Group>
                            }}
                            creatorButtonProps={{
                                position: 'bottom',
                                creatorButtonText: '添加一条 server'
                            }}
                            alwaysShowItemLabel={true}
                        >
                            {() => {
                                return (
                                    <>
                                        <ProForm.Group>
                                            <ProFormText
                                                width="md"
                                                name="upstreamHost"
                                                label={ServerEnum.UPSTREAM_HOST}
                                                rules={requiredRuleUtil(ServerEnum.UPSTREAM_HOST)}
                                            />
                                            <ProFormText
                                                width="md"
                                                name="upstreamPort"
                                                label={ServerEnum.UPSTREAM_PORT}
                                                rules={requiredRuleUtil(ServerEnum.UPSTREAM_HOST)}
                                            />
                                        </ProForm.Group>
                                        <ProFormText
                                            width={100}
                                            name="weight"
                                            label={ServerEnum.WEIGHT}
                                            tooltip={ServerTipsEnum.WEIGHT}
                                        />
                                        <ProFormDigit
                                            width={100}
                                            name="maxCons"
                                            label={ServerEnum.MAX_CONN}
                                            tooltip={ServerTipsEnum.MAX_CONN}
                                        />
                                        <ProFormDigit
                                            width={100}
                                            name="maxFails"
                                            label={ServerEnum.MAX_FAILS}
                                            tooltip={ServerTipsEnum.MAX_FAILS}
                                        />
                                        <ProFormText
                                            width={100}
                                            name="failTimeout"
                                            label={ServerEnum.FAIL_TIMEOUT}
                                            tooltip={ServerTipsEnum.FAIL_TIMEOUT}
                                        />
                                        <ProFormSwitch
                                            name="backup"
                                            label={ServerEnum.BACKUP}
                                            tooltip={ServerTipsEnum.BACKUP}
                                        />
                                        <ProFormSwitch
                                            name="down"
                                            label={ServerEnum.DOWN}
                                            tooltip={ServerTipsEnum.DOWN}
                                        />
                                    </>
                                )
                            }}
                        </ProFormList>
                    )
                }}
            </ProFormDependency>
        </DrawerForm>
    )
}

export default UpstreamModel
