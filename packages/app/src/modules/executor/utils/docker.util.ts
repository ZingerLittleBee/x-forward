import { $, nothrow } from 'zx'

export const dockerExec = async (containerName: string, cmd: string, ...args: string[]) => {
    $.quote = input => {
        return input === '|' ? '|' : input
    }
    const { exitCode, stdout, stderr } = await nothrow($`docker exec ${containerName} ${cmd} ${[...args]}`)
    return exitCode === 0 ? stdout || stderr : ''
}
