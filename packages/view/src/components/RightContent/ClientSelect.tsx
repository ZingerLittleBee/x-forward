import { Select, Tooltip, Typography } from 'antd'

const { Option } = Select
const { Title } = Typography

export interface ClientProps {
    clients: API.ClientVo[]
}

const ClientSelect: React.FC<ClientProps> = ({ clients }) => {
    return (
        <Select defaultValue={clients?.[0]?.id}>
            {clients.map(c => (
                <Option value={c.id as string} key={c.id}>
                    <Tooltip title={c?.comment}>
                        <span className="font-bold">{c.domain ? c.domain : c.ip}</span>
                    </Tooltip>
                </Option>
            ))}
        </Select>
    )
}
export default ClientSelect
