import { $, cd, nothrow } from 'zx'

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

const findSomething = async (something: string) => {
    const res = await nothrow($`which ${something}`)
    return res.exitCode === 0 ? res.stdout : ''
}

const checkCompoileUtil = () => {}

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

/**
 * return fileName by input url
 */
export const fetchDirectory = async (url: string): Promise<string> => {
    const res = await nothrow($`ls -F ${url} | grep "/$"`)
    return res.exitCode === 0 ? res.stdout : ''
}
