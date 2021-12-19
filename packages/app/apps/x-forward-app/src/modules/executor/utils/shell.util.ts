import { $, nothrow } from 'zx'
import { ShellEnum } from '../../../enums/ShellEnum'

export const ShellExec = async (cmd: ShellEnum | string, ...args: any[]) => {
    $.quote = input => {
        return input === '>>' ? '>>' : input
    }
    console.log('cmd', cmd)
    const { stdout, stderr, exitCode } = await nothrow($`${cmd} ${[...args]}`)
    return {
        exitCode,
        res: stdout || stderr
    }
}
