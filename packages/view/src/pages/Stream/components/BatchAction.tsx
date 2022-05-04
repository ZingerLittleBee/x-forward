import { Button, Checkbox, Dropdown, Menu, Modal, Typography } from 'antd'
import React from 'react'
import styles from '@/pages/Stream/index.less'
import { DownCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal
const { Text } = Typography

export type BatchActionProp = {
    menus: DropDownMenu[]
    curClientTag: string
    onCheckChange: (checked: boolean) => void
    onCancel: () => void
}

export type DropDownMenu = {
    type: string
    label: string
    key?: string
    icon?: React.ReactNode
    onOk?: () => Promise<void>
    menuClick?: () => void
}

const dropDownOverlay = (
    menus: DropDownMenu[],
    curClientTag: string,
    onCheckChange: (checked: boolean) => void,
    onCancel: () => void
) => (
    <Menu>
        {menus.map((menus, index) => {
            const { type, label, key = '', icon = <></>, onOk } = menus
            return (
                <Menu.Item
                    key={key ? key : index}
                    icon={icon}
                    onClick={() => {
                        menus.menuClick
                            ? menus.menuClick()
                            : confirm({
                                  title: (
                                      <span>
                                          是否确定{type}
                                          {
                                              <Text underline code>
                                                  {curClientTag}
                                              </Text>
                                          }
                                          下所有规则 ?
                                      </span>
                                  ),
                                  icon: icon,
                                  visible: true,
                                  content: (
                                      <Checkbox onChange={e => onCheckChange(e.target.checked)}>
                                          应用到所有服务器
                                      </Checkbox>
                                  ),
                                  onOk() {
                                      onOk?.()
                                  },
                                  onCancel() {
                                      onCancel?.()
                                  }
                              })
                    }}
                >
                    {label}
                </Menu.Item>
            )
        })}
    </Menu>
)

const BatchAction: React.FC<BatchActionProp> = ({ menus, curClientTag, onCheckChange, onCancel }) => {
    return (
        <Dropdown overlay={dropDownOverlay(menus, curClientTag, onCheckChange, onCancel)}>
            <Button className={styles.batchBtn} style={{ color: 'white' }}>
                批量操作 <DownCircleOutlined />
            </Button>
        </Dropdown>
    )
}

export default BatchAction
