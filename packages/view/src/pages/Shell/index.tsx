import WebTerminal from '@/components/WebTerminal'
import { PageContainer } from '@ant-design/pro-layout'
import { useModel } from '@@/plugin-model/useModel'

const Shell = () => {
    const { initialState } = useModel('@@initialState')
    const socket = initialState?.socket
    return (
        <PageContainer>
            <WebTerminal id="web-terminal" socket={socket} />
        </PageContainer>
    )
}

export default Shell
