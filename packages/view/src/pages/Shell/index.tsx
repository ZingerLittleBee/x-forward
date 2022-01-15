import WebTerminal from '@/components/WebTerminal'
import { useModel } from '@@/plugin-model/useModel'

const Shell = () => {
    const { initialState } = useModel('@@initialState')
    const socket = initialState?.socket
    return <WebTerminal id="web-terminal" socket={socket} />
}

export default Shell
