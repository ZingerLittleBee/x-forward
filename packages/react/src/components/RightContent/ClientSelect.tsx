import lsConstant from '@/constants/localstorage.constant'
import { DisconnectOutlined, WifiOutlined } from '@ant-design/icons'
import { OnlineTipsEnum } from '@forwardx/shared'
import { Select, Tag } from 'antd'
import React from 'react'

const { Option } = Select

export interface ClientProps {
    curClientId: string
    clients: API.ClientVo[]
    loading: boolean
    onChange: () => void
}

const optionLabel = (c: API.ClientVo) => (
    <>
        <Tag icon={c?.isOnline ? <WifiOutlined /> : <DisconnectOutlined />} color={c?.isOnline ? '#722ED1' : '#cd201f'}>
            {c?.isOnline ? OnlineTipsEnum.Online : OnlineTipsEnum.Offline}
        </Tag>
        <span className="font-bold">{c.domain ? c.domain : c.ip}</span>
    </>
)

const ClientSelect: React.FC<ClientProps> = ({ curClientId, clients, loading, onChange }) => {
    const handleSelect = (value: string) => {
        localStorage.setItem(lsConstant.CurClientId, value)
        onChange()
    }

    return (
        <Select
            style={{ minWidth: 280 }}
            defaultValue={curClientId ? curClientId : clients?.[0]?.id}
            disabled={loading}
            optionLabelProp="label"
            onChange={handleSelect}
        >
            {clients.map(c => (
                <Option label={optionLabel(c)} value={c.id as string} key={c.id}>
                    {optionLabel(c)}
                </Option>
            ))}
        </Select>
    )
}
export default ClientSelect
