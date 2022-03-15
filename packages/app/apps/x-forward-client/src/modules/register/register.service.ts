import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'
import { EnvKeyEnum, RegisterClientInfo, UserProperty } from '@x-forward/common'
import { getEnvSetting } from '@x-forward/common/utils/env.utils'
import { errorHandleWarpper } from '@x-forward/common/utils/error.util'
import { ExecutorService } from '@x-forward/executor'
import { CronJob } from 'cron'
import { firstValueFrom } from 'rxjs'
import { inspect } from 'util'
import { IReportService } from '../../interfaces/report.interface'
import { GrpcHelperService } from '../grpc-helper/grpc-helper.service'
@Injectable()
export class RegisterService implements OnModuleInit {
    constructor(
        private readonly executorService: ExecutorService,
        private readonly grpcHelperService: GrpcHelperService,
        private readonly schedulerRegistry: SchedulerRegistry
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

    private heartBeat() {
        errorHandleWarpper(() => firstValueFrom(this.reportService.heartBeat({ id: this.client.id })), 'heart beat')
    }

    private addCronJob(name: string, task: () => void, interval: string) {
        const job = new CronJob(interval, task)
        this.schedulerRegistry.addCronJob(name, job)
        job.start()
        Logger.log(`job ${name} added at ${interval}`)
    }

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
        return errorHandleWarpper<{ id: string }>(
            () => firstValueFrom(this.reportService.register(client)),
            'register',
            true
        )
    }

    private async initClient() {
        if (!this.client.ip) this.client.ip = await this.getClientIp()
        if (!this.client.domain) this.client.domain = getEnvSetting(EnvKeyEnum.ClientDomain)
        if (!this.client.port) this.client.port = getEnvSetting(EnvKeyEnum.ClientPort)
        try {
            this.client.id = (await this.register(this.client))?.id
        } catch (e) {
            setTimeout(() => this.initClient(), 2000)
            Logger.error(`client 注册失败, ${e}`)
            return
        }
        this.userProperties = await this.getPortAndUserRelation(this.client.id)
        this.addCronJob('HeartBeat', () => this.heartBeat(), getEnvSetting(EnvKeyEnum.HeartBeatCron))
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
}
