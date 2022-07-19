import type { ITerminalOptions } from 'xterm'
import React from 'react'

// import c from 'ansi-colors'
import 'xterm/css/xterm.css'
import RcResizeObserver from 'rc-resize-observer'
import useTerminal from '@/hooks/useTerminal'
import './index.less'
import type { Socket } from 'socket.io-client'

export interface TerminalProps {
    id?: string
    config?: ITerminalOptions
    socket?: Socket
}

const WebTerminal: React.FC<TerminalProps> = props => {
    const handlerResize = useTerminal(props)
    return (
        <RcResizeObserver onResize={handlerResize}>
            <div>
                <div id={props.id} style={{ height: 500 }} />
            </div>
        </RcResizeObserver>
    )
}

WebTerminal.defaultProps = {
    id: 'web-terminal',
    config: {
        allowTransparency: true,
        fontFamily: 'operator mono,SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace',
        fontSize: 14,
        theme: {
            background: '#141729',
            foreground: '#01CC74'
        },
        cursorBlink: true
    }
}

export default WebTerminal
