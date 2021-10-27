import ShellEnum from 'src/enums/ShellEnum'
import { $, nothrow } from 'zx'

export const ShellExec = async (cmd: ShellEnum | string, ...args: any[]) => {
    $.quote = input => {
        return input === '>>' ? '>>' : input
    }
    const { stdout, stderr, exitCode } = await nothrow($`${cmd} ${[...args]}`)
    return {
        exitCode,
        res: stdout || stderr
    }
}
