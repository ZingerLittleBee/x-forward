import { isUndef } from '@/utils/commonUtils'
import { getEnumKeyByValue, loadBalancingSelectProp } from '@/utils/enumUtils'
import { hostRule, portRule, requiredRule } from '@/utils/ruleUtil'
import ProForm, {
    DrawerForm,
    ProFormDependency,
    ProFormDigit,
    ProFormList,
    ProFormSelect,
    ProFormSwitch,
    ProFormText
} from '@ant-design/pro-form'
import {
    getKeysOfEnum,
    ServerEnum,
    ServerTipsEnum,
    TimeUnitEnum,
    TimeUnitTipsEnum,
    UpstreamEnum
} from '@x-forward/shared'
import { Form, message, Select } from 'antd'
import { FormInstance } from 'antd/es'
import { isString } from 'lodash'
import React, { useEffect, useState } from 'react'
import './index.less'

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

const { Option } = Select

type UpstreamProps = {
    title?: string
    trigger?: JSX.Element
    onUpstreamSubmit: (data: API.UpdateUpstreamDto | API.CreateUpstreamDto) => void
    visible?: boolean
    upstream?: API.UpstreamVo | undefined
    upstreamName?: Record<string, string> | string
    onUpstreamSelectChange?: (id: string) => void
    onClose?: (form: FormInstance) => void
}

const UpstreamModel: React.FC<UpstreamProps> = ({
    title = '上游服务',
    trigger,
    upstream,
    upstreamName,
    visible,
    onUpstreamSelectChange,
    onUpstreamSubmit,
    onClose
}) => {
    const [form] = Form.useForm()
    useEffect(() => {
        form.setFieldsValue({
            name: upstream?.name,
            server: upstream?.server,
            loadBalancing: upstream?.loadBalancing
        })
    }, [form, upstream])

    const timeUnitKeys = getKeysOfEnum(TimeUnitEnum)

    const [timeUnit, setTimeunit] = useState(TimeUnitEnum[timeUnitKeys[0]])

    const selectUnitAfter = (
        <Select
            defaultValue={TimeUnitEnum[timeUnitKeys[0]]}
            style={{
                width: 60,
                marginLeft: -8
            }}
            onChange={e => setTimeunit(e)}
        >
            {timeUnitKeys?.map(t => (
                <Option key={t} value={TimeUnitEnum[t]}>
                    {TimeUnitTipsEnum[t]}
                </Option>
            ))}
        </Select>
    )
    return (
        <DrawerForm
            title={title}
            form={form}
            trigger={trigger}
            visible={visible}
            onFinish={async (e: API.UpdateUpstreamDto | API.CreateUpstreamDto) => {
                if (!e?.server?.length) {
                    message.warn('最少添加一条 server')
                    return
                }
                // add time unit for failTimeout
                e.server = e.server.map(s =>
                    s?.failTimeout ? { ...s, failTimeout: `${s.failTimeout}${timeUnit}` } : s
                )
                try {
                    upstream ? onUpstreamSubmit({ ...e, id: upstream?.id }) : onUpstreamSubmit(e)
                } catch (e) {
                    return false
                }
                return true
            }}
            drawerProps={{
                onClose() {
                    onClose?.(form)
                }
            }}
        >
            {isString(upstreamName) || isUndef(upstreamName) ? (
                <ProFormText
                    name="name"
                    label={UpstreamEnum.Name}
                    rules={[requiredRule(UpstreamEnum.Name)]}
                    placeholder={`请输入${UpstreamEnum.Name}`}
                />
            ) : (
                <ProFormSelect
                    name="name"
                    label={UpstreamEnum.Name}
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
                label={UpstreamEnum.LoadBalancing}
                options={loadBalancingSelectProp()}
                initialValue={getEnumKeyByValue(upstream?.loadBalancing)}
                placeholder={`请选择${UpstreamEnum.LoadBalancing}`}
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
                            min={1}
                        >
                            {() => {
                                return (
                                    <>
                                        <ProForm.Group>
                                            <ProFormText
                                                width="md"
                                                name="upstreamHost"
                                                label={ServerEnum.UpstreamHost}
                                                rules={[requiredRule(ServerEnum.UpstreamHost), hostRule()]}
                                            />
                                            <ProFormDigit
                                                width="md"
                                                name="upstreamPort"
                                                label={ServerEnum.UpstreamPort}
                                                rules={[requiredRule(ServerEnum.UpstreamPort), portRule()]}
                                            />
                                        </ProForm.Group>
                                        <ProFormDigit
                                            width={100}
                                            min={1}
                                            name="weight"
                                            label={ServerEnum.Weight}
                                            tooltip={ServerTipsEnum.Weight}
                                        />
                                        <ProFormDigit
                                            width={100}
                                            name="maxCons"
                                            label={ServerEnum.MaxCons}
                                            tooltip={ServerTipsEnum.MaxCons}
                                        />
                                        <ProFormDigit
                                            width={100}
                                            name="maxFails"
                                            label={ServerEnum.MaxFails}
                                            tooltip={ServerTipsEnum.MaxFails}
                                        />
                                        <ProFormDigit
                                            width={100}
                                            name="failTimeout"
                                            label={ServerEnum.FailTimeout}
                                            tooltip={ServerTipsEnum.FailTimeout}
                                            addonAfter={selectUnitAfter}
                                        />
                                        <ProFormSwitch
                                            name="backup"
                                            label={ServerEnum.Backup}
                                            tooltip={ServerTipsEnum.Backup}
                                        />
                                        <ProFormSwitch
                                            name="down"
                                            label={ServerEnum.Down}
                                            tooltip={ServerTipsEnum.Down}
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
