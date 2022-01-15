import { useIntl } from 'umi'
import { GithubOutlined } from '@ant-design/icons'
import { DefaultFooter } from '@ant-design/pro-layout'

export default () => {
    const intl = useIntl()
    const defaultMessage = intl.formatMessage({
        id: 'app.copyright.produced',
        defaultMessage: 'ZingLittleBee'
    })

    const currentYear = new Date().getFullYear()

    return (
        <DefaultFooter
            copyright={`${currentYear} ${defaultMessage}`}
            links={[
                {
                    key: 'x-forward',
                    title: 'x-forward',
                    href: 'https://github.com/ZingerLittleBee/x-forward-frontend',
                    blankTarget: true
                },
                {
                    key: 'github',
                    title: <GithubOutlined />,
                    href: 'https://github.com/ZingerLittleBee/x-forward-frontend',
                    blankTarget: true
                }
            ]}
        />
    )
}
