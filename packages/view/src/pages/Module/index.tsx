import { CommonEnum } from '@/enums/CommonEnum'
import EnvEnum from '@/enums/EnvEnum'
import { StatusEnum } from '@/enums/StatusEnum'
import { useModel } from '@@/plugin-model/useModel'
import { CheckSquareOutlined, MacCommandOutlined } from '@ant-design/icons'
import ProCard, { StatisticCard } from '@ant-design/pro-card'
import ProList from '@ant-design/pro-list'
import type { BadgeProps } from 'antd/lib/badge'
import RcResizeObserver from 'rc-resize-observer'
import { useState } from 'react'
import defaultSettings from '../../../config/defaultSettings'

const Module = () => {
    // const { data, error, loading, run } = useRequest(username => ({
    //   url: '/env/nginx?username=123',
    //   method: 'get',
    //   data: { username }
    // }), { manual: true })

    // const { data, error, loading, run } = useRequest('/env/nginx?username=123', { manual: true })
    // console.log('data', data)
    // console.log('error', error)
    // console.log('loading', loading)

    // const { initialState } = useModel('@@initialState')
    // const currEnv = initialState?.currEnv

    const imgStyle = {
        display: 'block',
        width: 42,
        height: 42
    }

    type DataItem = { id: string; name: string; image: JSX.Element; desc: string | string[]; subTitle?: string }

    const { initialState } = useModel('@@initialState')

    const nginxConfig = initialState?.nginxConfig

    const nginxArgsDataSource: DataItem[] = []
    for (const arg in nginxConfig?.args) {
        nginxArgsDataSource.push({
            id: arg,
            name: arg,
            image: <MacCommandOutlined style={{ fontSize: '22px', color: '#52c41a' }} />,
            desc: nginxConfig?.args[arg].value,
            subTitle: nginxConfig?.args[arg].label
        })
    }

    const nginxModuleDataSource: DataItem[] = []
    for (const module in nginxConfig?.module) {
        nginxModuleDataSource.push({
            id: module,
            name: module,
            image: <CheckSquareOutlined style={{ fontSize: '22px', color: defaultSettings.primaryColor }} />,
            desc: nginxConfig?.module[module]
        })
    }

    const overview = initialState?.overview

    const nginxStatus = overview?.nginxStatus

    const genIcon = (url: string) => {
        return <img style={imgStyle} src={url} alt="icon" />
    }

    type StatisticProps = {
        title: EnvEnum
        value: string
        status?: () => { value: string; status?: BadgeProps['status'] }
        icon: JSX.Element
    }[]

    const statisticProps: StatisticProps = [
        {
            title: EnvEnum.os,
            value: overview?.os ? overview.os : CommonEnum.PLACEHOLDER,
            icon: genIcon('https://iconfont.alicdn.com/s/66342523-5218-4c48-8213-453811e13cef_origin.svg')
        },
        {
            title: EnvEnum.nginxPath,
            value: overview?.nginxPath ? overview.nginxPath : CommonEnum.PLACEHOLDER,
            icon: genIcon('https://iconfont.alicdn.com/s/142b06ff-0e37-43ce-9211-6e15034272d6_origin.svg')
        },
        {
            title: EnvEnum.nginxStatus,
            value: nginxStatus !== undefined ? nginxStatus : CommonEnum.PLACEHOLDER,
            status: () => {
                switch (nginxStatus as unknown) {
                    case StatusEnum.Running:
                        return { value: '正在运行', status: 'processing' }
                    case StatusEnum.NotInstall:
                        return { value: '未安装', status: 'default' }
                    case StatusEnum.Stop:
                        return { value: '已停止', status: 'warning' }
                    case StatusEnum.Error:
                        return { value: '出错', status: 'error' }
                    case StatusEnum.Checking:
                        return { value: 'Checking', status: 'warning' }
                    default:
                        return { value: '未知', status: 'default' }
                }
            },
            icon: genIcon('https://iconfont.alicdn.com/s/c48d932d-f0b4-46c2-b5fe-0f05c630310a_origin.svg')
        },
        {
            title: EnvEnum.nginxUptime,
            value: overview?.nginxUptime ? overview.nginxUptime : CommonEnum.PLACEHOLDER,
            icon: genIcon('https://iconfont.alicdn.com/s/3d98ca59-a5ac-4462-945e-72cec8e6c11d_origin.svg')
        }
    ]

    const [responsive, setResponsive] = useState(false)
    const [argsDataSource, setArgsDataSource] = useState(nginxArgsDataSource)
    const [moduleDataSource, setModuleDataSource] = useState(nginxModuleDataSource)

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
                extra="2019年9月28日"
                split={responsive ? 'horizontal' : 'vertical'}
                bordered
                headerBordered
                style={{ marginTop: '10px' }}
            >
                <ProCard>
                    <ProList<DataItem>
                        rowKey="id"
                        headerTitle="Nginx路径"
                        dataSource={argsDataSource}
                        onDataSourceChange={setArgsDataSource}
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
                        dataSource={moduleDataSource}
                        onDataSourceChange={setModuleDataSource}
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
