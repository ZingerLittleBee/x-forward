import { HttpService } from '@nestjs/axios'
import { CACHE_MANAGER, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { EnvKeyEnum, IResult, RegisterClientInfo, UserProperty } from '@x-forward/common'
import { getEnvSetting } from '@x-forward/common/utils/env.utils'
import { ExecutorService } from '@x-forward/executor'
import { Cache } from 'cache-manager'
import { Observable } from 'rxjs'
import { inspect } from 'util'

interface ReportService {
    register(data: RegisterClientInfo): Observable<IResult<{ id: string }>>
    getPortAndUserRelation(data: string): Observable<IResult<UserProperty[]>>
}

@Injectable()
export class RegisterService implements OnModuleInit {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @Inject('REPORT_PACKAGE') private clientGrpc: ClientGrpc,
        private readonly httpService: HttpService,
        private readonly executorService: ExecutorService
    ) {
        this.client = {}
        this.userProperty = []
    }

    async onModuleInit() {
        this.reportService = this.clientGrpc.getService<ReportService>('ReportService')
        await this.initClient()
    }

    private reportService: ReportService

    private readonly client: RegisterClientInfo

    private userProperty: UserProperty[]

    private async initClient() {
        const ip = await this.getClientIp()
        ip && (this.client.ip = await this.getClientIp())
        getEnvSetting(EnvKeyEnum.ClientDomain) && (this.client.domain = getEnvSetting(EnvKeyEnum.ClientDomain))
        getEnvSetting(EnvKeyEnum.ClientPort) && (this.client.port = getEnvSetting(EnvKeyEnum.ClientPort))
        this.reportService.register(this.client).subscribe({
            next: registerResp => {
                Logger.verbose(`receive register response: ${inspect(registerResp)}`)
                if (registerResp?.success) {
                    this.client.id = registerResp?.data?.id
                    this.reportService.getPortAndUserRelation(this.client?.id).subscribe({
                        next: async relationResp => {
                            Logger.verbose(`receive register response: ${inspect(relationResp)}`)
                            if (relationResp?.success) {
                                this.userProperty = relationResp?.data
                            } else {
                                Logger.error(`getPortAndUserRelation fault: ${relationResp?.message}`)
                            }
                        },
                        error: err => Logger.error(`getPortAndUserRelation occurred error: ${err}`)
                    })
                } else {
                    Logger.warn(`register client fault: ${registerResp?.message}`)
                }
            },
            error: err => Logger.error(`register occurred error: ${err}`)
        })
        Logger.verbose(`client: ${inspect(this.client)} init finished`)
    }

    getClientIp() {
        return this.executorService.getIp()
    }

    // async userAndPortRelations() {
    //     this.httpService.get<IResult<UserProperty[]>>(`${GatewayEndPoint.RELATION}/${this.client.id}`).subscribe({
    //         next: axiosResponse => {
    //             const { data: res } = axiosResponse
    //             if (res?.success) {
    //                 if (res?.data?.length > 0) {
    //                     res.data.forEach(d => {
    //                         const relation = this.userProperty.find(u => u.userId === d.userId)
    //                         if (relation) relation.ports = d.ports
    //                         Logger.verbose(`userProperty: ${this.userProperty} updated`)
    //                     })
    //                 }
    //                 return
    //             }
    //             Logger.error(`get relation between user and port error: ${res?.message}!`)
    //         },
    //         error: err => {
    //             Logger.error(`fetch ${GatewayEndPoint.RELATION}/${this.client.id} occurred error: ${err}`)
    //             setTimeout(() => this.getUserAndPortRelations(), 5000)
    //         }
    //     })
    // }

    // register() {
    //     this.httpService
    //         .post<IResult<{ id: string }>>(GatewayEndPoint.REGISTER, {
    //             ...removeInvalidField(this.client)
    //         })
    //         .subscribe({
    //             next: axiosResponse => {
    //                 const { data: res } = axiosResponse
    //                 if (res?.success) {
    //                     this.client.id = res.data?.id
    //                     if (this.client.id) {
    //                         Logger.verbose(`register success! clientId is ${this.client.id}`)
    //                         // this.getUserAndPortRelations()
    //                         return
    //                     }
    //                 }
    //                 Logger.error(`register error: ${res.message}!`)
    //             },
    //             error: err => {
    //                 Logger.error(`fetch ${GatewayEndPoint.REGISTER} occurred error: ${err}`)
    //                 setTimeout(() => this.register(), 1000)
    //             }
    //         })
    // }

    getClientId() {
        return this.client?.id
    }

    getUserAndPortRelations() {
        return this.userProperty
    }

    getServerUrl() {
        return getEnvSetting(EnvKeyEnum.ServerUrl)
    }
}
