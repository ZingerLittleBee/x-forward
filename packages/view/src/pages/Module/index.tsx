import { useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard, { StatisticCard } from '@ant-design/pro-card'
import { Space, Tag } from 'antd'
import RcResizeObserver from 'rc-resize-observer'
import { MacCommandOutlined } from '@ant-design/icons'
import ProList from '@ant-design/pro-list'
import DirTreeSelect from '@/pages/Module/components/DirTreeSelect'
import { useModel } from '@@/plugin-model/useModel'
import EnvEnum from '@/enums/EnvEnum'
import StatusEnum from '@/enums/StatusEnum'
import DirEnum from '@/enums/DirEnum'

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

    type DataItem = { id: string; name: string; image: JSX.Element; desc: string | string[] }

    const { initialState } = useModel('@@initialState')

    const defaultDataSource = initialState?.nginxPath?.map((n, index) => {
        return {
            id: index.toString(),
            name: n.label,
            image: <MacCommandOutlined style={{ fontSize: '22px', color: '#52c41a' }} />,
            desc: n.value
        }
    })

    const overview = initialState?.currEnv

    const genIcon = (url: string) => {
        return <img style={imgStyle} src={url} alt="icon" />
    }

    const statisticProps = [
        {
            title: EnvEnum.os,
            value: overview?.os ? overview.os : '-',
            icon: genIcon('https://iconfont.alicdn.com/s/66342523-5218-4c48-8213-453811e13cef_origin.svg')
        },
        {
            title: EnvEnum.nginxPath,
            value: overview?.nginxPath ? overview.nginxPath : '-',
            icon: genIcon('https://iconfont.alicdn.com/s/142b06ff-0e37-43ce-9211-6e15034272d6_origin.svg')
        },
        {
            title: EnvEnum.nginxStatus,
            value: overview?.nginxStatus !== undefined ? overview.nginxStatus : '-',
            status: () => {
                switch (overview?.nginxStatus) {
                    case StatusEnum.Running:
                        return { value: '正在运行', status: 'processing' }
                    case StatusEnum.NotInstall:
                        return { value: '未安装', status: 'default' }
                    case StatusEnum.Stop:
                        return { value: '已停止', status: 'warning' }
                    case StatusEnum.Error:
                        return { value: '出错', status: 'error' }
                    default:
                        return { value: '未知', status: 'default' }
                }
            },
            icon: genIcon('https://iconfont.alicdn.com/s/c48d932d-f0b4-46c2-b5fe-0f05c630310a_origin.svg')
        },
        {
            title: EnvEnum.nginxUptime,
            value: overview?.nginxUptime ? overview.nginxUptime : '-',
            icon: genIcon('https://iconfont.alicdn.com/s/3d98ca59-a5ac-4462-945e-72cec8e6c11d_origin.svg')
        }
    ]

    const [responsive, setResponsive] = useState(false)
    const [dataSource, setDataSource] = useState<DataItem[] | undefined>(defaultDataSource)

    return (
        <PageContainer>
            <RcResizeObserver
                key="resize-observer"
                onResize={offset => {
                    setResponsive(offset.width < 596)
                }}
            >
                <StatisticCard.Group title="概览" direction={responsive ? 'column' : 'row'}>
                    {statisticProps.map(s => {
                        // @ts-ignore
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
                        dataSource={dataSource}
                        showActions="hover"
                        editable={{
                            actionRender: (row, config, dom) => [dom.save, dom.cancel],
                            onSave: async (key, record, originRow) => {
                                console.log(key, record, originRow)
                                return true
                            }
                        }}
                        onDataSourceChange={setDataSource}
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
                                renderFormItem: () => <DirTreeSelect onChange={v => console.log('vaklue', v)} />
                            },
                            subTitle: {
                                render: (dom, entity) => (
                                    <Space size={0}>
                                        <Tag color="blue">{Object.keys(DirEnum).filter(d => entity.name === DirEnum[d])[0]}</Tag>
                                    </Space>
                                )
                            },
                            actions: {
                                render: (text, row, index, action) => [
                                    <a
                                        onClick={() => {
                                            action?.startEditable(row.id)
                                        }}
                                        key="link"
                                    >
                                        编辑
                                    </a>
                                ]
                            }
                        }}
                    />
                </ProCard>
                <ProCard>
                    <ProList<DataItem>
                        rowKey="id"
                        headerTitle="已安装模块"
                        dataSource={dataSource}
                        showActions="hover"
                        editable={{
                            onSave: async () => {
                                return true
                            }
                        }}
                        onDataSourceChange={setDataSource}
                        metas={{
                            title: {
                                dataIndex: 'name'
                            },
                            avatar: {
                                dataIndex: 'image',
                                editable: false
                            },
                            description: {
                                dataIndex: 'desc'
                            },
                            subTitle: {
                                render: () => {
                                    return (
                                        <Space size={0}>
                                            <Tag color="blue">Ant Design</Tag>
                                            <Tag color="#5BD8A6">TechUI</Tag>
                                        </Space>
                                    )
                                }
                            },
                            actions: {
                                render: (text, row, index, action) => [
                                    <a
                                        onClick={() => {
                                            action?.startEditable(row.id)
                                        }}
                                        key="link"
                                    >
                                        编辑
                                    </a>
                                ]
                            }
                        }}
                    />
                </ProCard>
            </ProCard>
        </PageContainer>
    )
}

export default Module
