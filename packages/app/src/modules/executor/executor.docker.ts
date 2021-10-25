import { Logger } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { EOL } from 'os'
import { join } from 'path/posix'
import { MakesureDirectoryExists } from 'src/decorators/file.decorator'
import { RemoveEndOfLine } from 'src/decorators/string.decorator'
import { EnvEnum } from 'src/enums/EnvEnum'
import { NginxConfigArgsEnum } from 'src/enums/NginxEnum'
import { getEnvSetting } from 'src/utils/env.util'
import { v4, validate } from 'uuid'
import { $ } from 'zx'
import ShellEnum from '../../enums/ShellEnum'
import { ExecutorInterface, NginxConfig } from './interface/executor.interface'
import { fetchNginxConfigArgs, getNginxCache } from './utils/cache.util'
import { dockerExec } from './utils/docker.util'

export class ExecutorDocker implements ExecutorInterface {
    constructor(private containerName: string, private cacheManager: Cache) {
        this.containerName = containerName
        this.cacheManager = cacheManager
    }

    async getNginxVersion() {
        const nginxBin = await this.getNginxBin()
        const { stdout, stderr, exitCode } = await dockerExec(this.containerName, nginxBin, ['-V'])
        // why return value of `nginx -V` in the stderr
        return exitCode === 0 && (stdout || stderr)
    }

    @RemoveEndOfLine()
    async getNginxBin() {
        const nginxBinInCache = (await getNginxCache(this.cacheManager))?.args[NginxConfigArgsEnum.SBIN_PATH]?.value
        if (nginxBinInCache) return nginxBinInCache
        const nginxBinInEnv = getEnvSetting[EnvEnum.NGINX_BIN]
        if (nginxBinInEnv) return nginxBinInEnv
        const { stdout } = await dockerExec(this.containerName, ShellEnum.WHICH, ['nginx'])
        if (!stdout) throw new Error('找不到 nginx 执行目录')
        return stdout
    }

    async getNginxConfigArgs() {
        const nginxConfigAtgsInCache = await getNginxCache(this.cacheManager)
        if (nginxConfigAtgsInCache) return nginxConfigAtgsInCache
        return fetchNginxConfigArgs(await this.getNginxVersion(), this.cacheManager)
    }

    async mainConfigAppend(appendString: string) {
        $`docker exec ${this.containerName} bash -c "echo -e ${appendString} >> ${await this.getMainConfigPath()}"`
    }

    async getMainConfigContent() {
        const { stdout } = await dockerExec(this.containerName, ShellEnum.CAT, [await this.getMainConfigPath()])
        return stdout
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

    streamPatch() {}
    async getStreamConfigPath() {
        let streamDir = await this.getStreamDirectory()
        // 获取目录下文件列表
        const { stdout } = await dockerExec(this.containerName, ShellEnum.LS, [streamDir])
        let fileList = []
        if (stdout !== '') fileList = stdout.split(EOL)
        for (let i = 0; i < fileList.length; i++) {
            let fileName = fileList[i].split('.')[0]
            // 如果文件名是 uuid, 则直接返回
            if (validate(fileName)) {
                return join(streamDir, fileList[i])
            }
        }
        // 不存在, 则创建文件
        let newStreamPath = join(streamDir, `${v4()}.conf`)
        dockerExec(this.containerName, ShellEnum.TOUCH, [newStreamPath])
        return newStreamPath
    }
    getHTTPConfigPath: () => Promise<string>

    async getStreamFileContent() {
        const { stdout } = await dockerExec(this.containerName, ShellEnum.CAT, [await this.getStreamConfigPath()])
        return stdout
    }
}
