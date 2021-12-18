import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { message } from 'antd'
import React, { useEffect, useState } from 'react'
import ProForm, { ProFormCheckbox, ProFormText } from '@ant-design/pro-form'
import { useIntl, Link, history, FormattedMessage, SelectLang } from 'umi'
import Footer from '@/components/Footer'
import figlet from 'figlet'
// @ts-ignore
import standard from 'figlet/importable-fonts/Standard.js'

import styles from './index.less'
import { UserControllerLogin } from '@/services/x-forward-frontend/user'

figlet.parseFont('Standard', standard)

// const LoginMessage: React.FC<{
//     content: string
// }> = ({ content }) => (
//     <Alert
//         style={{
//             marginBottom: 24
//         }}
//         message={content}
//         type="error"
//         showIcon
//     />
// )

const Login: React.FC = () => {
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        figlet.text('X-Forward', 'Standard', (error, result) => {
            if (error) {
                return
            }
            console.log(result)
        })
    }, [])

    const intl = useIntl()

    const handleSubmit = async (values: API.LoginUserDto) => {
        setSubmitting(true)
        try {
            // 登录
            const msg = await UserControllerLogin({ ...values })
            if (msg.success) {
                const defaultLoginSuccessMessage = intl.formatMessage({
                    id: 'pages.login.success',
                    defaultMessage: '登录成功！'
                })
                message.success(defaultLoginSuccessMessage)
                // await fetchUserInfo()
                /** 此方法会跳转到 redirect 参数所在的位置 */
                if (!history) return
                const { query } = history.location
                const { redirect } = query as { redirect: string }
                history.push(redirect || '/')
                return
            }
            // 如果失败去设置用户错误信息
            // setUserLoginState(msg)
        } catch (error) {
            const defaultLoginFailureMessage = intl.formatMessage({
                id: 'pages.login.failure',
                defaultMessage: '登录失败，请重试！'
            })
            message.error(defaultLoginFailureMessage)
        }
        setSubmitting(false)
    }
    return (
        <div className={styles.container}>
            <div className={styles.lang} data-lang>
                {SelectLang && <SelectLang />}
            </div>
            <div className={styles.content}>
                <div className={styles.top}>
                    <div className={styles.header}>
                        <Link to="/">
                            <span className={styles.title}>X Forward</span>
                        </Link>
                    </div>
                    <div className={styles.desc}>{intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}</div>
                </div>

                <div className={styles.main}>
                    <ProForm
                        initialValues={{
                            autoLogin: true
                        }}
                        submitter={{
                            searchConfig: {
                                submitText: intl.formatMessage({
                                    id: 'pages.login.submit',
                                    defaultMessage: '登录'
                                })
                            },
                            render: (_, dom) => dom.pop(),
                            submitButtonProps: {
                                loading: submitting,
                                size: 'large',
                                style: {
                                    width: '100%'
                                }
                            }
                        }}
                        onFinish={async values => {
                            await handleSubmit(values as API.LoginUserDto)
                        }}
                    >
                        {
                            <>
                                <ProFormText
                                    name="username"
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <UserOutlined className={styles.prefixIcon} />
                                    }}
                                    initialValue="admin"
                                    placeholder={intl.formatMessage({
                                        id: 'pages.login.username.placeholder',
                                        defaultMessage: '用户名: admin or user'
                                    })}
                                    rules={[
                                        {
                                            required: true,
                                            message: (
                                                <FormattedMessage
                                                    id="pages.login.username.required"
                                                    defaultMessage="请输入用户名!"
                                                />
                                            )
                                        }
                                    ]}
                                />
                                <ProFormText.Password
                                    name="password"
                                    initialValue="admin"
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <LockOutlined className={styles.prefixIcon} />
                                    }}
                                    placeholder={intl.formatMessage({
                                        id: 'pages.login.password.placeholder',
                                        defaultMessage: '密码: admin or user'
                                    })}
                                    rules={[
                                        {
                                            required: true,
                                            message: (
                                                <FormattedMessage
                                                    id="pages.login.password.required"
                                                    defaultMessage="请输入密码！"
                                                />
                                            )
                                        }
                                    ]}
                                />
                            </>
                        }
                        <div
                            style={{
                                marginBottom: 24
                            }}
                        >
                            <ProFormCheckbox noStyle name="autoLogin">
                                <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
                            </ProFormCheckbox>
                            <a
                                style={{
                                    float: 'right'
                                }}
                            >
                                <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
                            </a>
                        </div>
                    </ProForm>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Login
