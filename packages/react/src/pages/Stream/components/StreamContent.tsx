import { CommonEnum, StateEnum, StateTipsEnum, StreamItemEnum } from '@forwardx/shared'
import { Button, Dropdown, Menu, Tag, Typography } from 'antd'
import { DownOutlined, PlayCircleOutlined, QuestionOutlined, WarningOutlined } from '@ant-design/icons'
import { getEnumKeyByValue } from '@/utils/enumUtils'
import { utc2local } from '@/utils/timeUtil'
import ProDescriptions from '@ant-design/pro-descriptions'

const { Text, Paragraph } = Typography

type StreamContentProp = {
    dataSource: API.StreamVo
    getUpstreamById: (upstreamId?: string) => API.UpstreamVo | undefined
    onUpstreamClick?: (streamId?: string, upstreamId?: string) => void
}

const remoteRuleServers = (servers?: API.ServerEntity[]) => {
    return (
        <Menu>
            {servers?.map((s, index) => (
                <Menu.Item key={`${s.id}_${index}`}>
                    <Tag color="processing">
                        <code>
                            <Paragraph
                                style={{ marginBottom: 0 }}
                                copyable={{ tooltips: false }}
                            >{`${s.upstreamHost}:${s.upstreamPort}`}</Paragraph>
                        </code>
                    </Tag>
                </Menu.Item>
            ))}
        </Menu>
    )
}

const StreamContent: React.FC<StreamContentProp> = ({ dataSource, getUpstreamById, onUpstreamClick }) => {
    return (
        <ProDescriptions
            // title={d.title}
            column={1}
            labelStyle={{ color: '#6B7280' }}
            contentStyle={{ fontWeight: 500 }}
            dataSource={dataSource}
            columns={[
                // Standalone version is not needed for now
                // {
                //     title: StreamItemEnum.transitHost,
                //     dataIndex: 'transitHost'
                // },
                {
                    title: StreamItemEnum.TransitPort,
                    dataIndex: 'transitPort'
                },
                // render `${StreamItemEnum.remoteHost}: xxx`, if it doesn't have upstream
                // render `${StreamItemEnum.remoteRule}: xxx`, if it has upstream
                {
                    render: (_, { upstreamId, remoteHost }) => {
                        return (
                            <div className="ant-descriptions-item-container">
                                <span className="ant-descriptions-item-label" style={{ color: 'rgb(107, 114, 128)' }}>
                                    {upstreamId ? StreamItemEnum.RemoteRule : StreamItemEnum.RemoteHost}
                                </span>
                                <span className="ant-descriptions-item-content" style={{ fontWeight: 500 }}>
                                    {upstreamId ? (
                                        <Dropdown
                                            arrow
                                            trigger={['hover', 'click']}
                                            overlay={remoteRuleServers(getUpstreamById(upstreamId)?.server)}
                                            placement="bottom"
                                        >
                                            <Button size="small">
                                                Rules <DownOutlined />
                                            </Button>
                                        </Dropdown>
                                    ) : (
                                        remoteHost
                                    )}
                                </span>
                            </div>
                        )
                    }
                },
                // render `${StreamItemEnum.remotePort}: xxx`, if it doesn't have upstream
                // render `${StreamItemEnum.loadBalancing}: xxx`, if it has upstream
                {
                    render: (_, { upstreamId, remotePort }) => {
                        return (
                            <div className="ant-descriptions-item-container">
                                <span className="ant-descriptions-item-label" style={{ color: 'rgb(107, 114, 128)' }}>
                                    {upstreamId ? StreamItemEnum.LoadBalancing : StreamItemEnum.RemotePort}
                                </span>
                                <span className="ant-descriptions-item-content" style={{ fontWeight: 500 }}>
                                    {upstreamId
                                        ? getEnumKeyByValue(getUpstreamById(upstreamId)?.loadBalancing)
                                        : remotePort}
                                </span>
                            </div>
                        )
                    }
                },
                {
                    title: StreamItemEnum.Upstream,
                    render: (_, entity) => {
                        const { upstreamId, id } = entity
                        const upstream = getUpstreamById(upstreamId)
                        return (
                            <Text underline onClick={() => onUpstreamClick?.(id, upstreamId)}>
                                {upstream?.name || CommonEnum.PlaceHolder}
                            </Text>
                        )
                    }
                },
                {
                    title: StreamItemEnum.State,
                    dataIndex: 'state',
                    valueEnum: StateEnum,
                    render: (_, entity) => {
                        switch (entity.state as unknown) {
                            case StateEnum.Able:
                                return (
                                    <Tag icon={<PlayCircleOutlined />} color="success">
                                        {StateTipsEnum.Able}
                                    </Tag>
                                )
                            case StateEnum.Disable:
                                return (
                                    <Tag icon={<WarningOutlined />} color="warning">
                                        {StateTipsEnum.Disable}
                                    </Tag>
                                )
                            default:
                                return (
                                    <Tag icon={<QuestionOutlined />} color="magenta">
                                        {StateTipsEnum.Unknown}
                                    </Tag>
                                )
                        }
                    }
                },
                {
                    title: StreamItemEnum.CreateTime,
                    renderText: (text, { createTime }) => {
                        return createTime ? utc2local(createTime) : CommonEnum.PlaceHolder
                    }
                },
                {
                    title: StreamItemEnum.Comment,
                    dataIndex: 'comment'
                }
            ]}
        />
    )
}

export default StreamContent
