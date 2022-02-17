import { HttpService } from '@nestjs/axios'
import { CACHE_MANAGER, Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientDefaultEnum, ClientEnvKeyEnum, getEnvSetting, getOrSet } from '@x-forward/common'
import { CreateClientDto } from 'apps/x-forward-server/src/modules/client/dto/create-client.dto'
import { Cache } from 'cache-manager'
import CacheEnum from '../../enums/cache.enum'
import UrlEnum from '../../enums/url.enum'

@Injectable()
export class RegisterService implements OnModuleInit {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private readonly httpService: HttpService) {
        this.client = {}
    }

    onModuleInit() {
        this.register()
    }

    private client: { id?: string; ip?: string; domain?: string }

    private initClient() {}

    getClientIp() {
        const envIp = getEnvSetting(ClientEnvKeyEnum.ClientIp)
        if (!envIp) {
        }
    }

    async getPortAndUserRelations() {}

    register() {
        const client: CreateClientDto = {
            communicationPort: 3000
        }
        this.httpService.post<{ data: { id: string } }>(UrlEnum.Register, { data: client }).subscribe(axiosResponse => {
            this.client.id = axiosResponse?.data?.data?.id
            console.log('clientId: ', this.client.id)
        })
    }

    async getClientId() {
        return getOrSet(this.cacheManager, CacheEnum.ClientId)
    }

    getServerUrl() {
        return getEnvSetting(ClientEnvKeyEnum.ServerUrl, ClientDefaultEnum)
    }
}
