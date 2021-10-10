import type { TerminalProps } from '@/components/WebTerminal'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { useEffect } from 'react'

const useTerminal = (terminalProps: TerminalProps) => {
    const terminal = new Terminal(terminalProps.config)
    const fitAddon = new FitAddon()

    const handlerResize = () => {
        fitAddon.fit()
        terminalProps.socket?.emit('terminal-resize', {
            dimensions: {
                cols: fitAddon.proposeDimensions().cols,
                rows: fitAddon.proposeDimensions().rows
            }
        })
    }
    terminal.loadAddon(fitAddon)

    useEffect(() => {
        terminal.open(document.getElementById(terminalProps.id as string) as HTMLElement)
        terminal.focus()
        fitAddon.fit()
        terminalProps.socket?.emit('terminal-start')
        terminal.onData(data => {
            terminalProps.socket?.emit('terminal-data', data)
        })
    }, [terminalProps.id, terminalProps.socket])

    terminalProps.socket?.on('terminal-data', data => {
        terminal.write(data)
    })

    return handlerResize
}

export default useTerminal
