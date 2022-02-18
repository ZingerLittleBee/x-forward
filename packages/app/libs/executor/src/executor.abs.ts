import { ClientEnvKeyEnum, getEnvSetting, ShellEnum, shellExec } from '@x-forward/common'
import { IpEnum } from '@x-forward/common/enums/config.enum'
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
            return res
        }
        const clientIp = getEnvSetting(ClientEnvKeyEnum.ClientIp)
        if (clientIp) {
            return clientIp
        }
        const clientDomain = removeProtocol(getEnvSetting(ClientEnvKeyEnum.ClientDomain))
        if (clientDomain) {
            const { address } = await lookup(clientDomain)
            if (address) return address
        }
        return undefined
    }
}
