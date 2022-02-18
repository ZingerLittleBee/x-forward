import { Logger } from '@nestjs/common'
import { EnvKeyEnum, NginxConfigArgsEnum, ServiceEnum, ShellEnum } from '@x-forward/common'
import { fetchNginxConfigArgs, getNginxCache } from '@x-forward/common/utils/cache.utils'
import { getEnvSetting } from '@x-forward/common/utils/env.utils'
import { findSomething, shellExec } from '@x-forward/common/utils/shell.utils'
import { IExecutor, NginxStatus } from '@x-forward/executor/interfaces'
import { Cache } from 'cache-manager'
import { appendFile, readdir, readFile } from 'fs/promises'
import { EOL } from 'os'
import { join } from 'path'
import { v4, validate } from 'uuid'
import { ExecutorAbs } from './executor.abs'

export class ExecutorLocal extends ExecutorAbs implements IExecutor {
    constructor(private readonly bin: string, private readonly cacheManager: Cache) {
        super()
        this.bin = bin
        this.cacheManager = cacheManager
    }
    async getSystemInfo() {
        const { res } = await shellExec(
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
        const [hostname, kernelRelease, kernelVersion, hardware, distributorId, description, release, codename] = res
            .split(EOL)
            .map(r => {
                return r.includes(':') ? r.split(':')[r.split(':').length - 1].trim() : r
            })
        return {
            hostname,
            kernelRelease,
            kernelVersion,
            hardware,
            distributorId,
            description,
            release,
            codename
        }
    }

    async queryNginxStatus() {
        const status: NginxStatus = {}
        let cmd = (await findSomething(ShellEnum.SERVICE)).trim()
        if (!cmd) {
            cmd = (await findSomething(ShellEnum.SYSTEMCTL)).trim()
        }
        if (!cmd) {
            Logger.warn(`系统不存在, ${ShellEnum.SERVICE}, ${ShellEnum.SYSTEMCTL}`)
            return {}
        }
        const { res: serviceStatus } = await shellExec(cmd, 'nginx', ServiceEnum.STATUS)
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

    nginxReload() {
        shellExec(this.bin, '-s', 'reload')
    }

    nginxRestart() {
        shellExec(ShellEnum.SERVICE, 'nginx', 'restart')
    }
    async fetchDirectory(url: string) {
        // add "/" automatic if url no "/" at the beginning
        if (!url.match(/^\//)) {
            url = '/' + url
        }
        // ls -F ${url} | grep "/$"
        return (await shellExec(ShellEnum.LS, '-F', url, '|', ShellEnum.GREP, '"/$"')).res
    }
    async getNginxVersion() {
        return (await shellExec(this.bin, '-V'))?.res
    }
    async getNginxBin() {
        return this.bin
    }
    async getNginxConfigArgs() {
        return fetchNginxConfigArgs(await this.getNginxVersion())
    }
    async mainConfigAppend(appendString: string) {
        appendFile(await this.getMainConfigPath(), appendString)
    }
    async getMainConfigContent() {
        return readFile(await this.getMainConfigPath(), 'utf-8')
    }
    async getStreamDirectory() {
        return join(await this.getPrefix(), getEnvSetting(EnvKeyEnum.StreamDir))
    }
    async getPrefix() {
        return (await getNginxCache(this.cacheManager))?.args[NginxConfigArgsEnum.PREFIX]?.value
    }
    async getMainConfigPath() {
        return (await getNginxCache(this.cacheManager))?.args[NginxConfigArgsEnum.CONF_PATH].value
    }
    async getStreamConfigPath() {
        // 先查找缓存
        const nginxConfigArgs = await getNginxCache(this.cacheManager)
        if (nginxConfigArgs?.args[NginxConfigArgsEnum.STREAM_PATH]?.value)
            return nginxConfigArgs?.args[NginxConfigArgsEnum.STREAM_PATH].value
        const streamDir = await this.getStreamDirectory()
        // 获取目录下文件列表
        const fileList = await readdir(streamDir)
        for (let i = 0; i < fileList.length; i++) {
            const fileName = fileList[i].split('.')[0]
            // 如果文件名是 uuid, 则直接返回
            if (validate(fileName)) {
                return join(streamDir, fileList[i])
            }
        }
        // 不存在, 则创建文件
        const newStreamPath = join(streamDir, `${v4()}.conf`)
        shellExec(ShellEnum.TOUCH, [newStreamPath])
        return newStreamPath
    }
    async getStreamFileContent() {
        return readFile(await this.getStreamConfigPath(), { encoding: 'utf-8' })
    }
    getHTTPConfigPath: () => Promise<string>

    /**
     * 1. 先备份一份原配置文件, 名为 stream.conf.bak
     * 2. 新配置文件覆写
     * 3. nginx -t -c stream.conf 检查语法是否通过
     * 4. 不通过则回滚 stream.conf.bak
     * @param content 新 stream 文件内容
     */
    async streamPatch(content: string) {
        const streamPath = await this.getStreamConfigPath()
        const backupRes = await shellExec(ShellEnum.CP, streamPath, `${streamPath}.bak`)
        if (backupRes.exitCode === 0) {
            Logger.verbose(`${streamPath} 备份成功`)
        } else {
            Logger.error(`${streamPath} 备份失败, ${backupRes.res}`)
            throw new Error(`${streamPath} 备份失败, ${backupRes.res}`)
        }
        shellExec(ShellEnum.CAT, '>', `${streamPath}<<EOF\n${content}\nEOF`)
        const { res, exitCode } = await shellExec(await this.getNginxBin(), '-t', '-c', await this.getMainConfigPath())
        if (exitCode) {
            Logger.error(`配置文件格式有误: ${res}, 即将回滚`)
            // rollback
            const rollbackRes = await shellExec(ShellEnum.MV, `${streamPath}.bak`, streamPath)
            rollbackRes.exitCode === 0
                ? Logger.verbose(`${streamPath} 回滚成功`)
                : Logger.error(`${streamPath} 回滚失败, ${rollbackRes.res}`)
        }
        this.nginxReload()
    }
}
