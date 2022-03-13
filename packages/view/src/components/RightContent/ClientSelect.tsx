import lsConstant from '@/constants/localstorage.constant'
import { DisconnectOutlined, WifiOutlined } from '@ant-design/icons'
import { OnlineEnum } from '@x-forward/shared'
import { Select, Tag, Tooltip } from 'antd'

const { Option } = Select

export interface ClientProps {
    clients: API.ClientVo[]
    loading: boolean
    onChange: () => void
}

const clientId = localStorage.getItem(lsConstant.CurClientId)

const ClientSelect: React.FC<ClientProps> = ({ clients, loading, onChange }) => {
    const handleSelect = (value: string) => {
        localStorage.setItem(lsConstant.CurClientId, value)
        onChange()
    }

    return (
        <Select
            style={{ minWidth: 280 }}
            defaultValue={clientId ? clientId : clients?.[0]?.id}
            disabled={loading}
            onChange={handleSelect}
        >
            {clients.map(c => (
                <Option value={c.id as string} key={c.id}>
                    <Tooltip title={c?.comment}>
                        {c?.isOnline ? (
                            <Tag icon={<WifiOutlined />} color="#722ED1">
                                {OnlineEnum.Online}
                            </Tag>
                        ) : (
                            <Tag icon={<DisconnectOutlined />} color="#cd201f">
                                {OnlineEnum.Offline}
                            </Tag>
                        )}
                        <span className="font-bold">{c.domain ? c.domain : c.ip}</span>
                    </Tooltip>
                </Option>
            ))}
        </Select>
    )
}
export default ClientSelect
