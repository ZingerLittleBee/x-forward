import { $, cd, nothrow } from 'zx'
import { ShellEnum } from '..'

export const shellExec = async (cmd: ShellEnum | string, ...args: any[]) => {
    $.quote = input => {
        return input === '>>' ? '>>' : input
    }
    const { stdout, stderr, exitCode } = await nothrow($`${cmd} ${[...args]}`)
    return {
        exitCode,
        res: stdout || stderr
    }
}

export const getNginxVersion = async (bin: string) => {
    return shellExec(bin, '-V')
}

export const getSystemInfoString = async () => {
    return shellExec(
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

export const fetchDirByPath = async (path: string) => shellExec(ShellEnum.LS, '-F', path, '|', ShellEnum.GREP, '"/$"')

export const appendFile = async (filePath: string, content: string) => {
    return shellExec(ShellEnum.CAT, '>', `${filePath}<<EOF\n${content}\nEOF`)
}

export const rewriteFile = async (filePath: string, content: string) => {
    return shellExec(ShellEnum.CAT, '<<', `EOF>${filePath}\n${content}\nEOF`)
}

export const checkNginxConfigGrammar = async (nginxBin: string, configPath: string) => {
    return shellExec(nginxBin, '-t', '-c', configPath)
}

export const backupFile = async (filePath: string) => {
    return shellExec(ShellEnum.CP, filePath, `${filePath}.bak`)
}

export const rollbackFile = async (filePath: string) => {
    return shellExec(ShellEnum.MV, `${filePath}.bak`, filePath)
}

export const findSomething = async (something: string) => {
    const res = await nothrow($`which ${something}`)
    return res.exitCode === 0 ? res.stdout : ''
}

/**
 * install nginx
 * @param version nginx version need to install
 * @param handlerMsg handler system std
 */
export const installNginx = async (version: string, handlerMsg?: (msg: string) => void) => {
    handlerMsg && handlerMsg(`$ wget http://nginx.org/download/nginx-${version}.tar.gz\n`)
    const downloadRes = $`wget http://nginx.org/download/nginx-${version}.tar.gz`
    // let res = $`sleep 1; echo 1; sleep 2; echo 2`
    handlerMsg &&
        downloadRes.stderr.on('data', msg => {
            handlerMsg(msg + '\n')
        })
    await downloadRes
    handlerMsg && handlerMsg(`$ tar zxvf nginx-${version}.tar.gz`)
    const unzipRes = $`tar zxvf nginx-${version}.tar.gz`
    handlerMsg &&
        unzipRes.stdout.on('data', msg => {
            handlerMsg(msg + '\n')
        })
    await unzipRes
    handlerMsg && handlerMsg(`$ cd nginx-${version}`)
    cd(`nginx-${version}`)
}

/**
 * get infomation of os
 * @returns linux release infomation
 */
export const checkOS = async () => {
    const lsb = await nothrow($`lsb_release -d`)
    if (lsb.stdout) {
        return lsb.stdout.replace(/Description:|\t|\n/g, '')
    }
    const catRedhat = await $`cat /etc/redhat-release`
    if (catRedhat.stdout) {
        return catRedhat.stdout
    }
    const catIssue = await $`cat /etc/issue`
    if (catIssue) {
        return catIssue.stdout.replace(/\n|\l/, '')
    }
    return ''
}
