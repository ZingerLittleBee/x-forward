import { Logger } from '@nestjs/common'
import {
    dockerExec,
    EnvEnum,
    fetchNginxConfigArgs,
    getEnvSetting,
    getNginxCache,
    MakesureDirectoryExists,
    NginxConfigArgsEnum,
    NginxConfigArgsReflectEnum,
    RemoveEndOfLine,
    ServiceEnum,
    ShellEnum
} from '@x-forward/common'
import { Cache } from 'cache-manager'
import { EOL } from 'os'
import { join } from 'path/posix'
import { v4, validate } from 'uuid'
import { IExecutor } from '@x-forward/executor/interfaces'
import { NginxConfig } from '@x-forward/executor/interfaces'
import { NginxStatus } from '@x-forward/executor/interfaces'

export class ExecutorDocker implements IExecutor {
    constructor(private containerName: string, private cacheManager: Cache) {
        this.containerName = containerName
        this.cacheManager = cacheManager
    }
    async getSystemInfo() {
        const { res } = await dockerExec(
            this.containerName,
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
        let cmd = (await dockerExec(this.containerName, ShellEnum.WHICH, ShellEnum.SERVICE))?.res?.trim()
        if (!cmd) {
            cmd = (await dockerExec(this.containerName, ShellEnum.SYSTEMCTL))?.res?.trim()
        }
        if (!cmd) {
            Logger.warn(`系统不存在, ${ShellEnum.SERVICE}, ${ShellEnum.SYSTEMCTL}`)
            return {}
        }
        const { res: serviceStatus } = await dockerExec(this.containerName, cmd, 'nginx', ServiceEnum.STATUS)
        console.log('serviceStatus', serviceStatus)
        const active = serviceStatus.match(/(?<=Active\:\s)(.*\))/)?.[0]
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
    async fetchDirectory(url: string) {
        if (!url.match(/^\//)) {
            url = '/' + url
        }
        // ls -F ${url} | grep "/$"
        return (await dockerExec(this.containerName, ShellEnum.LS, '-F', url, '|', ShellEnum.GREP, '"/$"')).res
    }

    async getNginxVersion() {
        const nginxBin = await this.getNginxBin()
        // why return value of `nginx -V` in the stderr
        return (await dockerExec(this.containerName, nginxBin, '-V')).res
    }

    @RemoveEndOfLine()
    async getNginxBin() {
        const nginxBinInCache = (await getNginxCache(this.cacheManager))?.args[NginxConfigArgsEnum.SBIN_PATH]?.value
        if (nginxBinInCache) return nginxBinInCache
        const nginxBinInEnv = getEnvSetting[EnvEnum.NGINX_BIN]
        if (nginxBinInEnv) return nginxBinInEnv
        const { res } = await dockerExec(this.containerName, ShellEnum.WHICH, 'nginx')
        if (!res) throw new Error('找不到 nginx 执行目录')
        return res
    }

    async getNginxConfigArgs() {
        const nginxConfigArgsInCache = await getNginxCache(this.cacheManager)
        if (nginxConfigArgsInCache) return nginxConfigArgsInCache
        return fetchNginxConfigArgs(await this.getNginxVersion(), this.cacheManager)
    }

    async mainConfigAppend(appendString: string) {
        dockerExec(
            this.containerName,
            ShellEnum.BASH,
            '-c',
            `"${ShellEnum.CAT}>>${await this.getMainConfigPath()}<<EOF\n${appendString}\nEOF"`
        )
    }

    async getMainConfigContent() {
        return (await dockerExec(this.containerName, ShellEnum.CAT, await this.getMainConfigPath())).res
    }

    private async getNginxConfArgs(): Promise<NginxConfig> {
        return getNginxCache(this.cacheManager)
    }

    async getPrefix() {
        return (await this.getNginxConfArgs())?.args[NginxConfigArgsEnum.PREFIX]?.value
    }
    async getMainConfigPath() {
        return (await getNginxCache(this.cacheManager))?.args[NginxConfigArgsEnum.CONF_PATH].value
    }

    @MakesureDirectoryExists(true)
    async getStreamDirectory() {
        Logger.verbose(`nginx prefix: ${await this.getPrefix()}, stream_dir: ${getEnvSetting(EnvEnum.STREAM_DIR)}`)
        return join(await this.getPrefix(), getEnvSetting(EnvEnum.STREAM_DIR))
    }

    async getStreamConfigPath() {
        // 先查找缓存
        const nginxConfigArgs = await getNginxCache(this.cacheManager)
        if (nginxConfigArgs?.args[NginxConfigArgsEnum.STREAM_PATH]?.value)
            return nginxConfigArgs?.args[NginxConfigArgsEnum.STREAM_PATH].value
        const streamDir = await this.getStreamDirectory()
        // 获取目录下文件列表
        const { res } = await dockerExec(this.containerName, ShellEnum.LS, streamDir)
        let fileList = []
        if (res !== '') fileList = res.split(EOL)
        for (let i = 0; i < fileList.length; i++) {
            const fileName = fileList[i].split('.')[0]
            // 如果文件名是 uuid, 则直接返回
            if (validate(fileName)) {
                return join(streamDir, fileList[i])
            }
        }
        // 不存在, 则创建文件
        const newStreamPath = join(streamDir, `${v4()}.conf`)
        dockerExec(this.containerName, ShellEnum.TOUCH, newStreamPath)
        nginxConfigArgs.args[NginxConfigArgsEnum.STREAM_PATH] = {
            label: NginxConfigArgsReflectEnum[NginxConfigArgsEnum.STREAM_PATH],
            value: newStreamPath
        }
        return newStreamPath
    }
    getHTTPConfigPath: () => Promise<string>

    async getStreamFileContent() {
        return (await dockerExec(this.containerName, ShellEnum.CAT, await this.getStreamConfigPath())).res
    }

    async nginxReload() {
        const nginxReloadRes = await dockerExec(this.containerName, await this.getNginxBin(), '-s', 'reload')
        nginxReloadRes.exitCode === 0
            ? Logger.verbose(`nginx reload 成功`)
            : Logger.error(`nginx reload 失败, ${nginxReloadRes.res}`)
    }

    async nginxRestart() {
        const nginxRestartRes = await dockerExec(this.containerName, ShellEnum.SERVICE, 'nginx', 'restart')
        nginxRestartRes.exitCode === 0
            ? Logger.verbose(`nginx restart 成功`)
            : Logger.error(`nginx restart 失败, ${nginxRestartRes.res}`)
    }

    /**
     * 1. 先备份一份原配置文件, 名为 stream.conf.bak
     * 2. 新配置文件覆写
     * 3. nginx -t -c stream.conf 检查语法是否通过
     * 4. 不通过则回滚 stream.conf.bak
     * @param content 新 stream 文件内容
     */
    async streamPatch(content: string) {
        const streamPath = await this.getStreamConfigPath()
        const backupRes = await dockerExec(this.containerName, ShellEnum.CP, streamPath, `${streamPath}.bak`)
        if (backupRes.exitCode === 0) {
            Logger.verbose(`${streamPath} 备份成功`)
        } else {
            Logger.error(`${streamPath} 备份失败, ${backupRes.res}`)
            throw new Error(`${streamPath} 备份失败, ${backupRes.res}`)
        }
        await dockerExec(
            this.containerName,
            ShellEnum.BASH,
            '-c',
            `"${ShellEnum.CAT}>${streamPath}<<EOF\n${content}\nEOF"`
        )
        const { res, exitCode } = await dockerExec(
            this.containerName,
            await this.getNginxBin(),
            '-t',
            '-c',
            await this.getMainConfigPath()
        )
        if (exitCode) {
            Logger.error(`配置文件格式有误: ${res}, 即将回滚`)
            // rollback
            const rollbackRes = await dockerExec(this.containerName, ShellEnum.MV, `${streamPath}.bak`, streamPath)
            rollbackRes.exitCode === 0
                ? Logger.verbose(`${streamPath} 回滚成功`)
                : Logger.error(`${streamPath} 回滚失败, ${rollbackRes.res}`)
        }
        await this.nginxReload()
    }
}
