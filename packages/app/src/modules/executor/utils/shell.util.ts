import ShellEnum from 'src/enums/ShellEnum'
import { $ } from 'zx'

const ShellExec = async (cmd: ShellEnum | string, ...args: any[]): Promise<string> => {
    $.quote = input => {
        return input === '>>' ? '>>' : input
    }
    const { stdout, stderr, exitCode } = await $`${cmd} ${[...args]}`
    console.log('stdout', stdout)
    console.log('stderr', stderr)
    console.log('exitCode', exitCode)
    return exitCode === 0 ? stdout || stderr : null
}
export { ShellExec }
