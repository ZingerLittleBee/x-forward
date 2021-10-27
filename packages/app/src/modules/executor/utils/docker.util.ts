import { $, nothrow } from 'zx'

export const dockerExec = async (containerName: string, cmd: string, ...args: string[]) => {
    $.quote = input => {
        if (input === '|') return '|'
        if (input === '>>') return '>>'
        if (input === '<<') return '<<'
        return input
    }
    const { exitCode, stdout, stderr } = await nothrow($`docker exec ${containerName} ${cmd} ${[...args]}`)
    return { res: stdout || stderr, exitCode }
}
