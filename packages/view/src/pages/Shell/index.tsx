import WebTerminal from '@/components/WebTerminal'
import { io } from 'socket.io-client'

const createSocket = (url: string) => {
    const socket = io(url)
    socket.on('connect', () => {
        console.log('ws connected success')
    })
    socket.on('connect_error', err => {
        console.log('ws occurred error: ', err)
    })
    socket.on('disconnect', reason => {
        console.log('ws disconnected: ', reason)
    })
    return socket
}

const socket = createSocket('localhost:1234')

const Shell = () => {
    return <WebTerminal id="web-terminal" socket={socket} />
}

export default Shell
