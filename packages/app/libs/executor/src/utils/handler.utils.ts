import { Logger } from '@nestjs/common'
import {
    appendFileInDocker,
    backupFile,
    backupFileInDocker,
    checkNginxConfigGrammar,
    checkNginxConfigGrammarInDocker,
    EnvKeyEnum,
    fetchDirByPath,
    fetchDirByPathInDocker,
    findSomething,
    getSystemInfoString,
    getSystemInfoStringInDocker,
    NginxConfigArgsEnum,
    rewriteFile,
    rewriteFileInDocker,
    rollbackFile,
    rollbackFileInDocker,
    ServiceEnum,
    ShellEnum
} from '@x-forward/common'
import { fetchNginxConfigArgs, getValueFromCache } from '@x-forward/common/utils/cache.utils'
import { dockerExec } from '@x-forward/common/utils/docker.utils'
import { getEnvSetting } from '@x-forward/common/utils/env.utils'
import { getNginxVersion, shellExec } from '@x-forward/common/utils/shell.utils'
import { NginxConfig, NginxStatus } from '@x-forward/executor'
import { CacheKeyEnum } from '@x-forward/executor/enums/key.enum'
import { Cache } from 'cache-manager'
import { appendFile, readdir } from 'fs/promises'
import { EOL } from 'os'
import { join } from 'path'
import { v4, validate } from 'uuid'

export const systemInfoHandler = async (
    cacheManager: Cache,
    options?: { isDocker?: boolean; containerName?: string }
) => {
    const { res, exitCode } = options?.isDocker
        ? await getSystemInfoStringInDocker(options?.containerName)
        : await getSystemInfoString()
    if (exitCode === 0) {
        Logger.warn(`获取系统信息失败: ${res}`)
    }
    const [hostname, kernelRelease, kernelVersion, hardware, distributorId, description, release, codename] = res
        .split(EOL)
        .map(r => {
            return r.includes(':') ? r.split(':')[r.split(':').length - 1].trim() : r
        })
    return cacheManager.set(CacheKeyEnum.SystemInfo, {
        hostname,
        kernelRelease,
        kernelVersion,
        hardware,
        distributorId,
        description,
        release,
        codename
    })
}

export const nginxStatusHandler = async (options?: { isDocker?: boolean; containerName?: string }) => {
    const status: NginxStatus = {}
    let cmd = options?.isDocker
        ? (await dockerExec(options?.containerName, ShellEnum.WHICH, ShellEnum.SERVICE))?.res?.trim()
        : (await findSomething(ShellEnum.SERVICE)).trim()

    if (!cmd) {
        cmd = options?.isDocker
            ? (await dockerExec(options?.containerName, ShellEnum.SYSTEMCTL))?.res?.trim()
            : (await findSomething(ShellEnum.SYSTEMCTL)).trim()
    }
    if (!cmd) {
        Logger.warn(`系统不存在, ${ShellEnum.SERVICE}, ${ShellEnum.SYSTEMCTL}`)
        return undefined
    }
    const { res: serviceStatus } = options?.isDocker
        ? await dockerExec(options?.containerName, cmd, 'nginx', ServiceEnum.STATUS)
        : await shellExec(cmd, 'nginx', ServiceEnum.STATUS)
    const active = serviceStatus.match(/(?<=Active:\s)(.*\))/)?.[0]
    active && (status.active = active)
    const uptime = serviceStatus.match(/(?<=;\s).*ago/)?.[0]
    uptime && (status.uptime = uptime)
    const since = serviceStatus.match(/(?<=since\s).*(?=;)/)?.[0]
    since && (status.since = since)
    const memory = serviceStatus.match(/(?<=Memory:\s).*/)?.[0]
    memory && (status.memory = memory)
    const mainPid = serviceStatus.match(/(?<=Main\sPID:\s)\d+/)?.[0]
    mainPid && (status.mainPid = mainPid)
    const workerPid = serviceStatus.match(/\d+(?=\snginx:\sworker\sprocess)/g)
    workerPid && (status.workerPid = workerPid)
    const tasks = serviceStatus.match(/(?<=Tasks:\s)\d/)?.[0]
    tasks && (status.tasks = tasks)
    const tasksLimit = serviceStatus.match(/(?<=limit:\s)\d+/)?.[0]
    tasksLimit && (status.tasksLimit = tasksLimit)
    return status
}

export const fetchDirectoryHandler = async (path: string, options?: { isDocker?: boolean; containerName?: string }) => {
    if (!path.match(/^\//)) {
        path = '/' + path
    }
    // ls -F ${url} | grep "/$"
    return options?.isDocker
        ? (await fetchDirByPathInDocker(options?.containerName, path)).res
        : (await fetchDirByPath(path)).res
}

export const nginxVersionHandler = async (
    nginxBin: string,
    cacheManager: Cache,
    options?: { isDocker?: boolean; containerName?: string }
) => {
    const cacheValue = await getValueFromCache<string>(cacheManager, CacheKeyEnum.NginxVersion)
    return cacheValue
        ? cacheValue
        : options?.isDocker
        ? (await dockerExec(options?.containerName, nginxBin, '-V')).res
        : (await getNginxVersion(nginxBin))?.res
}

export const nginxConfigArgsHandler = async (cacheManager: Cache, nginxVersion: string) => {
    const cacheValue = await getValueFromCache<NginxConfig>(cacheManager, CacheKeyEnum.NginxConfigArgs)
    return cacheValue
        ? cacheValue
        : cacheManager.set<NginxConfig>(CacheKeyEnum.NginxConfigArgs, fetchNginxConfigArgs(nginxVersion))
}

export const nginxPrefixHandler = async (
    bin: string,
    cacheManager: Cache,
    options?: { isDocker?: boolean; containerName?: string }
) => {
    const cacheValue = await getValueFromCache<string>(cacheManager, CacheKeyEnum.NginxPrefix)
    if (cacheValue) {
        return cacheValue
    } else {
        const nginxVersion = await nginxVersionHandler(bin, cacheManager, {
            isDocker: options?.isDocker,
            containerName: options?.containerName
        })
        return cacheManager.set<string>(
            CacheKeyEnum.NginxPrefix,
            (await nginxConfigArgsHandler(cacheManager, nginxVersion))?.args[NginxConfigArgsEnum.PREFIX]?.value
        )
    }
}

export const mainConfigPathHandler = async (
    bin: string,
    cacheManager: Cache,
    options?: { isDocker?: boolean; containerName?: string }
) => {
    const cacheValue = await getValueFromCache<string>(cacheManager, CacheKeyEnum.NginxMainConfigPath)
    if (cacheValue) {
        return cacheValue
    } else {
        const nginxVersion = await nginxVersionHandler(bin, cacheManager, {
            isDocker: options?.isDocker,
            containerName: options?.containerName
        })
        return cacheManager.set<string>(
            CacheKeyEnum.NginxMainConfigPath,
            (await nginxConfigArgsHandler(cacheManager, nginxVersion))?.args[NginxConfigArgsEnum.CONF_PATH]?.value
        )
    }
}

export const streamDirectoryHandler = async (
    bin: string,
    cacheManager: Cache,
    options?: { isDocker?: boolean; containerName?: string }
) => {
    const cacheValue = await getValueFromCache<string>(cacheManager, CacheKeyEnum.NginxStreamDir)
    return cacheValue
        ? cacheValue
        : cacheManager.set<string>(
              CacheKeyEnum.NginxStreamDir,
              join(await nginxPrefixHandler(bin, cacheManager, options), getEnvSetting(EnvKeyEnum.StreamDir))
          )
}

/**
 * update file content and check with nginx -t
 * @param bin nginx bin
 * @param path need update file path
 * @param content content
 * @param mainConfigPath nginx main config path
 * @param options options
 */
export const updateFileContentHandler = async (
    bin: string,
    path: string,
    content: string,
    mainConfigPath: string,
    options?: { isRewrite: boolean; isDocker?: boolean; containerName?: string }
) => {
    const { exitCode: backupExitCode, res: backupRes } = options?.isDocker
        ? await backupFileInDocker(options?.containerName, path)
        : await backupFile(path)
    if (backupExitCode === 0) {
        Logger.verbose(`${path} 备份成功`)
    } else {
        Logger.error(`${path} 备份失败: ${backupRes}`)
        throw new Error(`${path} 备份失败: ${backupRes}`)
    }
    if (options?.isRewrite) {
        options?.isDocker
            ? await rewriteFileInDocker(options?.containerName, path, content)
            : await rewriteFile(path, content)
    } else {
        options?.isDocker
            ? await appendFileInDocker(options?.containerName, path, content)
            : await appendFile(path, content)
    }
    const { res, exitCode } = options?.isDocker
        ? await checkNginxConfigGrammarInDocker(options?.containerName, bin, mainConfigPath)
        : await checkNginxConfigGrammar(bin, mainConfigPath)
    if (exitCode) {
        Logger.error(`配置文件格式有误: ${res}, 即将回滚`)
        // rollback
        const { exitCode: rollbackExitCode, res: rollbackRes } = options?.isDocker
            ? await rollbackFileInDocker(options?.containerName, path)
            : await rollbackFile(path)
        rollbackExitCode === 0 ? Logger.verbose(`${path} 回滚成功`) : Logger.error(`${path} 回滚失败: ${rollbackRes}`)
    }
}

export const streamConfigPathHandler = async (
    bin: string,
    cacheManager: Cache,
    options?: { isDocker?: boolean; containerName?: string }
) => {
    // 先查找缓存
    const streamConfigPathFromCache = await getValueFromCache<string>(cacheManager, CacheKeyEnum.NginxStreamConfigPath)
    if (streamConfigPathFromCache) {
        return streamConfigPathFromCache
    }
    const streamDir = await streamDirectoryHandler(bin, cacheManager, options)
    // 获取目录下文件列表
    let fileList = []
    if (options?.isDocker) {
        const { res: lsRes } = await dockerExec(options?.containerName, ShellEnum.LS, streamDir)
        if (lsRes !== '') fileList = lsRes.split(EOL)
    } else {
        fileList = await readdir(streamDir)
    }
    for (let i = 0; i < fileList.length; i++) {
        const fileName = fileList[i].split('.')[0]
        // 如果文件名是 uuid, 则直接返回
        if (validate(fileName)) {
            return join(streamDir, fileList[i])
        }
    }
    // 不存在, 则创建文件
    const newStreamPath = join(streamDir, `${v4()}.conf`)
    const { exitCode, res: toucheRes } = await dockerExec(options?.containerName, ShellEnum.TOUCH, newStreamPath)
    if (exitCode === 0) {
        await cacheManager.set(CacheKeyEnum.NginxStreamConfigPath, newStreamPath)
        return newStreamPath
    }
    Logger.warn(`获取 stream 配置文件路径失败: ${toucheRes}`)
    return undefined
}

export const nginxRestartHandler = async (options?: { isDocker?: boolean; containerName?: string }) => {
    const nginxRestartRes = options?.isDocker
        ? await dockerExec(options?.containerName, ShellEnum.SERVICE, 'nginx', 'restart')
        : await shellExec(ShellEnum.SERVICE, 'nginx', 'restart')
    nginxRestartRes.exitCode === 0
        ? Logger.verbose(`nginx restart 成功`)
        : Logger.error(`nginx restart 失败, ${nginxRestartRes.res}`)
}

export const nginxReloadHandler = async (bin: string, options?: { isDocker?: boolean; containerName?: string }) => {
    const nginxReloadRes = options?.isDocker
        ? await dockerExec(options?.containerName, bin, '-s', 'reload')
        : await shellExec(bin, '-s', 'reload')
    nginxReloadRes.exitCode === 0
        ? Logger.verbose(`nginx reload 成功`)
        : Logger.error(
              `nginx reopen failed: ${nginxReloadRes?.res}, Is nginx running?, and then try run\n$ ${bin} -s reload`
          )
    return nginxReloadRes.exitCode
}

export const nginxReopenHandler = async (bin: string, options?: { isDocker?: boolean; containerName?: string }) => {
    const nginxReopenRes = options?.isDocker
        ? await dockerExec(options?.containerName, bin, '-s', 'reopen')
        : await shellExec(bin, '-s', 'reopen')
    nginxReopenRes.exitCode === 0
        ? Logger.verbose(`nginx reopen 成功`)
        : Logger.error(
              `nginx reopen failed: ${nginxReopenRes?.res}, Is nginx running?, and then try run\n$ ${bin} -s reopen`
          )
    return nginxReopenRes.exitCode
}

export const getSystemTimeHandler = async (options?: { isDocker?: boolean; containerName?: string }) => {
    const result = options?.isDocker
        ? await dockerExec(options?.containerName, ShellEnum.DATE, '+%Y-%m-%d" "%T')
        : await shellExec(ShellEnum.DATE, '+%Y-%m-%d" "%T')
    if (result.exitCode === 0) {
        Logger.verbose(`get system time success, ${result.res}`)
        return result.res
    }
    Logger.error(`get system time error`)
    return ''
}
