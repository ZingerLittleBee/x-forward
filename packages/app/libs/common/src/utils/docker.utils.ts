import { $, nothrow } from 'zx'
import { ShellEnum } from '@x-forward/common/enums'

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

export const backupFileInDocker = async (containerName: string, path: string) => {
    return dockerExec(containerName, ShellEnum.CP, path, `${path}.bak`)
}

export const getSystemInfoStringInDocker = async (containerName: string) => {
    return dockerExec(
        containerName,
        ShellEnum.UNAME,
        '-n;',
        ShellEnum.UNAME,
        '-r;',
        ShellEnum.UNAME,
        '-v;',
        ShellEnum.UNAME,
        '-m;',
        ShellEnum.LSB_RELEASE,
        '-a;'
    )
}

export const fetchDirByPathInDocker = async (containerName: string, path: string) => {
    return dockerExec(containerName, ShellEnum.LS, '-F', path, '|', ShellEnum.GREP, '"/$"')
}

export const appendFileInDocker = async (containerName: string, filePath: string, content: string) => {
    return dockerExec(containerName, ShellEnum.BASH, '-c', `"${ShellEnum.CAT}>${filePath}<<EOF\n${content}\nEOF"`)
}

export const rewriteFileInDocker = async (containerName: string, filePath: string, content: string) => {
    return dockerExec(containerName, ShellEnum.BASH, '-c', `"${ShellEnum.CAT}<<EOF>${filePath}\n${content}\nEOF"`)
}

export const checkNginxConfigGrammarInDocker = async (containerName: string, nginxBin: string, configPath: string) => {
    return dockerExec(containerName, nginxBin, '-t', '-c', configPath)
}

export const rollbackFileInDocker = async (containerName: string, filePath: string) => {
    return dockerExec(containerName, ShellEnum.MV, `${filePath}.bak`, filePath)
}
