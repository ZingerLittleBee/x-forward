import { HttpService } from '@nestjs/axios'
import { CACHE_MANAGER, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ClientDefaultEnum, ClientEnvKeyEnum, getOrSet } from '@x-forward/common'
import { getEnvSetting } from '@x-forward/common/utils/env.utils'
import { ExecutorService } from '@x-forward/executor'
import { Cache } from 'cache-manager'
import CacheEnum from '../../enums/cache.enum'
import UrlEnum from '../../enums/url.enum'
import { RegisterClientInfo } from './register.interface'

@Injectable()
export class RegisterService implements OnModuleInit {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly httpService: HttpService,
        private readonly executorService: ExecutorService
    ) {
        this.client = {}
    }

    async onModuleInit() {
        await this.initClient()
        this.register()
    }

    private client: RegisterClientInfo

    private async initClient() {
        this.client.ip = await this.getClientIp()
        this.client.domain = getEnvSetting(ClientEnvKeyEnum.ClientDomain)
        this.client.communicationPort = getEnvSetting(ClientEnvKeyEnum.CommunicationPort)
    }

    getClientIp() {
        return this.executorService.getIp()
    }

    async getPortAndUserRelations() {}

    register() {
        this.httpService
            .post<{ data: { id: string } }>(UrlEnum.Register, { data: this.client })
            .subscribe(axiosResponse => {
                this.client.id = axiosResponse?.data?.data?.id
                Logger.verbose(`register success! clientId is ${this.client.id}`)
            })
    }

    async getClientId() {
        return getOrSet(this.cacheManager, CacheEnum.ClientId)
    }

    getServerUrl() {
        return getEnvSetting(ClientEnvKeyEnum.ServerUrl, ClientDefaultEnum)
    }
}
