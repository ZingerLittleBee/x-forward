import { Space, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import React from 'react'
import { useModel, SelectLang } from 'umi'
import Avatar from './AvatarDropdown'
import styles from './index.less'

export type SiderTheme = 'light' | 'dark'

const GlobalHeaderRight: React.FC = () => {
    const { initialState } = useModel('@@initialState')

    if (!initialState || !initialState.settings) {
        return null
    }

    const { navTheme, layout } = initialState.settings
    let className = styles.right

    if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
        className = `${styles.right}  ${styles.dark}`
    }
    return (
        <Space className={className}>
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
    )
}
export default GlobalHeaderRight
