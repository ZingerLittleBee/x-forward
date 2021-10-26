import ShellEnum from 'src/enums/ShellEnum'
import { $, nothrow } from 'zx'

const ShellExec = async (cmd: ShellEnum | string, ...args: any[]): Promise<string> => {
    $.quote = input => {
        return input === '>>' ? '>>' : input
    }
    const { stdout, stderr, exitCode } = await nothrow($`${cmd} ${[...args]}`)
    return exitCode === 0 ? stdout || stderr : ''
}
export { ShellExec }
