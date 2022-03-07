import { CACHE_MANAGER, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { EnvKeyEnum, RegisterClientInfo, UserProperty } from '@x-forward/common'
import { getEnvSetting } from '@x-forward/common/utils/env.utils'
import { errorHandleWarpper } from '@x-forward/common/utils/error.util'
import { ExecutorService } from '@x-forward/executor'
import { Cache } from 'cache-manager'
import { firstValueFrom } from 'rxjs'
import { inspect } from 'util'
import { IReportService } from '../../interfaces/report.interface'
import { GrpcHelperService } from '../grpc-helper/grpc-helper.service'
@Injectable()
export class RegisterService implements OnModuleInit {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly executorService: ExecutorService,
        private readonly grpcHelperService: GrpcHelperService
    ) {
        this.client = {}
        this.userProperties = []
    }

    async onModuleInit() {
        this.reportService = this.grpcHelperService.reportService
        await this.initClient()
    }

    private reportService: IReportService

    private readonly client: RegisterClientInfo

    private userProperties: UserProperty[]

    public setUserProperty(userProperties: UserProperty[]) {
        this.userProperties = userProperties
    }

    private async getPortAndUserRelation(clientId: string) {
        return errorHandleWarpper<UserProperty[]>(
            () => firstValueFrom(this.reportService.getPortAndUserRelation({ id: clientId })),
            'getPortAndUserRelation'
        )
    }

    private async register(client: RegisterClientInfo) {
        return errorHandleWarpper<{ id: string }>(() => firstValueFrom(this.reportService.register(client)), 'register')
    }

    private async initClient() {
        const ip = await this.getClientIp()
        ip && (this.client.ip = await this.getClientIp())
        getEnvSetting(EnvKeyEnum.ClientDomain) && (this.client.domain = getEnvSetting(EnvKeyEnum.ClientDomain))
        getEnvSetting(EnvKeyEnum.ClientPort) && (this.client.port = getEnvSetting(EnvKeyEnum.ClientPort))
        this.client.id = (await this.register(this.client))?.id
        this.userProperties = await this.getPortAndUserRelation(this.client.id)
        Logger.verbose(`client: ${inspect(this.client)} init finished`)
    }

    getClientIp() {
        return this.executorService.getIp()
    }

    getClientId() {
        return this.client?.id
    }

    getUserAndPortRelations() {
        return this.userProperties
    }

    getServerUrl() {
        return getEnvSetting(EnvKeyEnum.ServerUrl)
    }
}
