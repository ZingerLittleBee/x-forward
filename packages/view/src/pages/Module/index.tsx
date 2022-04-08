import { EnvControllerGetNginxConfig, EnvControllerGetOverview } from '@/services/view/env'
import { useModel } from '@@/plugin-model/useModel'
import { CheckSquareOutlined, MacCommandOutlined } from '@ant-design/icons'
import ProCard, { StatisticCard } from '@ant-design/pro-card'
import ProList from '@ant-design/pro-list'
import { CommonEnum, EnvEnum, NginxStatusEnum } from '@forwardx/shared'
import { message } from 'antd'
import type { BadgeProps } from 'antd/lib/badge'
import RcResizeObserver from 'rc-resize-observer'
import { useEffect, useState } from 'react'
import { inspect } from 'util'
import defaultSettings from '../../../config/defaultSettings'

type StatisticProps = {
    title: EnvEnum
    value: string | API.OverviewVo['nginxStatus']
    status?: () => { value: string; status?: BadgeProps['status'] }
    icon: JSX.Element
}[]

type DataItem = { id: string; name: string; image: JSX.Element; desc: string | string[]; subTitle?: string }

const imgStyle = {
    display: 'block',
    width: 42,
    height: 42
}

const genIcon = (url: string) => {
    return <img style={imgStyle} src={url} alt="icon" />
}

const genNginxArgsDataSource = (args: Record<string, any> | undefined) => {
    const nginxArgsDataSource: DataItem[] = []
    for (const arg in args) {
        nginxArgsDataSource.push({
            id: arg,
            name: arg,
            image: <MacCommandOutlined style={{ fontSize: '22px', color: '#52c41a' }} />,
            desc: args[arg].value,
            subTitle: args[arg].label
        })
    }
    return nginxArgsDataSource
}

const genNginxModuleDataSource = (module: string[] | undefined) => {
    return module?.map(m => ({
        id: m,
        name: m,
        desc: m,
        image: <CheckSquareOutlined style={{ fontSize: '22px', color: defaultSettings.primaryColor }} />
    }))
}

const Module = () => {
    const { initialState } = useModel('@@initialState')

    useEffect(() => {
        const overviewController = new AbortController()
        const nginxConfigController = new AbortController()
        const fetchOverview = async (clientId: string) => {
            const { success, data } = await EnvControllerGetOverview(
                { clientId },
                { signal: overviewController.signal }
            )
            success ? setOverview(data) : setOverview(undefined)
        }
        const fetchNginxConfig = async (clientId: string) => {
            const { success, data } = await EnvControllerGetNginxConfig(
                { clientId },
                { signal: nginxConfigController.signal }
            )
            success ? setNginxConfig(data) : setNginxConfig(undefined)
        }
        if (initialState?.curClientId) {
            fetchOverview(initialState?.curClientId).catch(e => {
                overviewController.abort()
                setOverview(undefined)
                message.error(`获取系统信息失败: ${inspect(e)}`)
            })
            fetchNginxConfig(initialState?.curClientId).catch(e => {
                nginxConfigController.abort()
                setNginxConfig(undefined)
                message.error(`获取 nginx 参数失败: ${inspect(e)}`)
            })
        }
    }, [initialState?.curClientId])

    const [responsive, setResponsive] = useState(false)
    const [overview, setOverview] = useState<API.OverviewVo | undefined>()
    const [nginxConfig, setNginxConfig] = useState<API.NginxConfigVo | undefined>()

    const statisticProps: StatisticProps = [
        {
            title: EnvEnum.OS,
            value: overview?.os ? overview.os : CommonEnum.PlaceHolder,
            icon: genIcon('https://iconfont.alicdn.com/s/66342523-5218-4c48-8213-453811e13cef_origin.svg')
        },
        {
            title: EnvEnum.NginxPath,
            value: overview?.nginxPath ? overview.nginxPath : CommonEnum.PlaceHolder,
            icon: genIcon('https://iconfont.alicdn.com/s/142b06ff-0e37-43ce-9211-6e15034272d6_origin.svg')
        },
        {
            title: EnvEnum.NginxStatus,
            value: overview?.nginxStatus !== undefined ? overview?.nginxStatus : CommonEnum.PlaceHolder,
            status: () => {
                switch (overview?.nginxStatus as unknown) {
                    case NginxStatusEnum.Running:
                        return { value: '正在运行', status: 'processing' }
                    case NginxStatusEnum.NotInstall:
                        return { value: '未安装', status: 'default' }
                    case NginxStatusEnum.Stop:
                        return { value: '已停止', status: 'warning' }
                    case NginxStatusEnum.Error:
                        return { value: '出错', status: 'error' }
                    case NginxStatusEnum.Checking:
                        return { value: 'Checking', status: 'warning' }
                    default:
                        return { value: '未知', status: 'default' }
                }
            },
            icon: genIcon('https://iconfont.alicdn.com/s/c48d932d-f0b4-46c2-b5fe-0f05c630310a_origin.svg')
        },
        {
            title: EnvEnum.NginxUptime,
            value: overview?.nginxUptime ? overview.nginxUptime : CommonEnum.PlaceHolder,
            icon: genIcon('https://iconfont.alicdn.com/s/3d98ca59-a5ac-4462-945e-72cec8e6c11d_origin.svg')
        }
    ]
    return (
        <>
            <RcResizeObserver
                key="resize-observer"
                onResize={offset => {
                    setResponsive(offset.width < 596)
                }}
            >
                <StatisticCard.Group title="概览" direction={responsive ? 'column' : 'row'}>
                    {statisticProps.map(s => {
                        return (
                            <StatisticCard
                                statistic={{
                                    title: s.title,
                                    value: s.status ? s.status().value : s.value,
                                    icon: s.icon,
                                    status: s.status ? s.status().status : undefined
                                }}
                                key={s.title}
                            />
                        )
                    })}
                </StatisticCard.Group>
            </RcResizeObserver>
            <ProCard
                title="Nginx 环境"
                extra={overview?.systemTime}
                split={responsive ? 'horizontal' : 'vertical'}
                bordered
                headerBordered
                style={{ marginTop: '10px' }}
            >
                <ProCard>
                    <ProList<DataItem>
                        rowKey="id"
                        headerTitle="Nginx路径"
                        dataSource={genNginxArgsDataSource(nginxConfig?.args)}
                        metas={{
                            title: {
                                dataIndex: 'name',
                                editable: false
                            },
                            avatar: {
                                dataIndex: 'image',
                                editable: false
                            },
                            description: {
                                dataIndex: 'desc',
                                editable: false
                            },
                            subTitle: {
                                dataIndex: 'subTitle',
                                editable: false
                            }
                        }}
                    />
                </ProCard>
                <ProCard>
                    <ProList<DataItem>
                        rowKey="id"
                        headerTitle="已安装模块"
                        dataSource={genNginxModuleDataSource(nginxConfig?.module)}
                        metas={{
                            title: {
                                dataIndex: 'desc'
                            },
                            avatar: {
                                dataIndex: 'image',
                                editable: false
                            }
                        }}
                    />
                </ProCard>
            </ProCard>
        </>
    )
}

export default Module
