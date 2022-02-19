import { Logger } from '@nestjs/common'
import { EnvKeyEnum, ShellEnum } from '@x-forward/common'
import { IpEnum } from '@x-forward/common/enums/config.enum'
import { getEnvSetting } from '@x-forward/common/utils/env.utils'
import { shellExec } from '@x-forward/common/utils/shell.utils'
import { removeProtocol } from '@x-forward/shared'
import { lookup } from 'dns/promises'
import { ISystem, SystemInfo } from './interfaces'

//https://stackoverflow.com/questions/44593961/why-does-abstract-class-have-to-implement-all-methods-from-interface
export abstract class ExecutorAbs implements ISystem {
    abstract fetchDirectory(url: string): Promise<string>
    abstract nginxReload(): void
    abstract nginxRestart(): void
    abstract getSystemInfo(): Promise<SystemInfo>
    async getIp(): Promise<string> {
        const { res, exitCode } = await shellExec(ShellEnum.Curl, IpEnum.IpConfig)
        if (exitCode === 0 && res) {
            Logger.verbose(`curl ${IpEnum.IpConfig} get ip: ${res}`)
            return res
        }
        Logger.verbose(`curl ${IpEnum.IpConfig} can not get response`)
        const clientIp = getEnvSetting(EnvKeyEnum.ClientIp)
        if (clientIp) {
            return clientIp
        }
        Logger.verbose(`can not get ip from env`)
        const clientDomain = removeProtocol(getEnvSetting(EnvKeyEnum.ClientDomain))
        if (clientDomain) {
            Logger.verbose(`get domain: ${clientDomain} from env`)
            const { address } = await lookup(clientDomain)
            if (address) return address
        }
        Logger.verbose(`can not get ip from lookup domain: ${clientDomain}`)
        Logger.error(`everything try, but can not get ip`)
        return undefined
    }
}
