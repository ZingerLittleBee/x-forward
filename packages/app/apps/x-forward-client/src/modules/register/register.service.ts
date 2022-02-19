import { HttpService } from '@nestjs/axios'
import { CACHE_MANAGER, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { EnvKeyEnum, getOrSet, IResult, RegisterClientInfo, UserProperty } from '@x-forward/common'
import EndPoint from '@x-forward/common/constants/endpoint.constant'
import { getEnvSetting } from '@x-forward/common/utils/env.utils'
import { ExecutorService } from '@x-forward/executor'
import { Cache } from 'cache-manager'
import CacheEnum from '../../enums/cache.enum'

@Injectable()
export class RegisterService implements OnModuleInit {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly httpService: HttpService,
        private readonly executorService: ExecutorService
    ) {
        this.client = {}
        this.userProperty = []
    }

    async onModuleInit() {
        await this.initClient()
        this.register()
    }

    private client: RegisterClientInfo

    private userProperty: UserProperty[]

    private async initClient() {
        this.client.ip = await this.getClientIp()
        this.client.domain = getEnvSetting(EnvKeyEnum.ClientDomain)
        this.client.port = getEnvSetting(EnvKeyEnum.ClientPort)
    }

    getClientIp() {
        return this.executorService.getIp()
    }

    async getUserAndPortRelations() {
        this.httpService.get<IResult<UserProperty[]>>(`${EndPoint.RELATION}/${this.client.id}`).subscribe({
            next: axiosResponse => {
                const { data: res } = axiosResponse
                if (res?.success) {
                    if (res?.data?.length > 0) {
                        res.data.forEach(d => {
                            const realtion = this.userProperty.find(u => u.userId === d.userId)
                            if (realtion) realtion.ports = d.ports
                        })
                    }
                }
                Logger.verbose(`userProperty: ${this.userProperty} updated`)
            },
            error: err => {
                Logger.error(`fetch ${EndPoint.RELATION}/${this.client.id} occurred error: ${err}`)
                setTimeout(() => this.getUserAndPortRelations(), 5000)
            }
        })
    }

    register() {
        this.httpService.post<IResult<{ id: string }>>(EndPoint.REGISTER, { data: this.client }).subscribe({
            next: axiosResponse => {
                const { data: res } = axiosResponse
                if (res?.success) {
                    this.client.id = res.data?.id
                    if (this.client.id) {
                        Logger.verbose(`register success! clientId is ${this.client.id}`)
                        this.getUserAndPortRelations()
                        return
                    }
                    Logger.error(`register error! can not get clientId`)
                }
            },
            error: err => {
                Logger.error(`fetch ${EndPoint.REGISTER} occurred error: ${err}`)
                setTimeout(() => this.register(), 1000)
            }
        })
    }

    async getClientId() {
        return getOrSet(this.cacheManager, CacheEnum.ClientId)
    }

    getServerUrl() {
        return getEnvSetting(EnvKeyEnum.ServerUrl)
    }
}
