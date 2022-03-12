import { QuestionCircleOutlined } from '@ant-design/icons'
import { Space, Tooltip } from 'antd'
import React from 'react'
import { SelectLang, useModel } from 'umi'
import Avatar from './AvatarDropdown'
import ClientSelect from './ClientSelect'
import styles from './index.less'

export type SiderTheme = 'light' | 'dark'

const GlobalHeaderRight: React.FC = () => {
    const { initialState, refresh, loading } = useModel('@@initialState')

    if (!initialState || !initialState.settings) {
        return null
    }

    const { navTheme, layout } = initialState.settings
    let className = styles.right

    if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
        className = `${styles.right}  ${styles.dark}`
    }

    const clients = initialState?.clients ? initialState?.clients : []
    return (
        <>
            <Space className={className}>
                <ClientSelect clients={clients} loading={loading} onChange={() => refresh()} />
                <Tooltip placement="bottom" title="文档">
                    <span
                        className={styles.action}
                        onClick={() => {
                            window.open('https://github.com/ZingerLittleBee/x-forward')
                        }}
                    >
                        <QuestionCircleOutlined />
                    </span>
                </Tooltip>
                <Avatar />
                <SelectLang className={styles.action} />
            </Space>
        </>
    )
}
export default GlobalHeaderRight
