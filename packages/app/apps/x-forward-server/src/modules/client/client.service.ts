import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { EnvKeyEnum, getEnvSetting, UserProperty } from '@x-forward/common'
import { IsOrNotEnum } from '@x-forward/shared'
import { CronJob } from 'cron'
import * as moment from 'moment'
import { Repository } from 'typeorm'
import { inspect } from 'util'
import { StreamService } from '../stream/stream.service'
import { ClientEntity } from './entity/client.entity'

@Injectable()
export class ClientService implements OnModuleInit {
    constructor(
        @InjectRepository(ClientEntity)
        private readonly clientRepository: Repository<ClientEntity>,
        private readonly schedulerRegistry: SchedulerRegistry,
        private readonly streamService: StreamService
    ) {}

    private async onlineCheck() {
        Logger.verbose('online checking...')
        const clients = await this.findAll()
        if (clients?.length === 0) {
            Logger.warn(`本次 onlineCheck 结束, 不存在 clients`)
            return
        }
        const maximumReportingSeconds = getEnvSetting(EnvKeyEnum.MaximumReportingSeconds)
        const needUpdateOnlineClients = clients.filter(c => {
            const maxReportTime = moment(c.lastCommunicationTime).add(maximumReportingSeconds, 's')
            if (maxReportTime.isAfter(moment())) {
                if (!c.isOnline) return true
            } else {
                if (c.isOnline) return true
            }
            return false
        })
        const needUpdateEntity = needUpdateOnlineClients.map(n => ({
            id: n.id,
            isOnline: n.isOnline ? IsOrNotEnum.False : IsOrNotEnum.True
        }))
        if (needUpdateEntity.length > 0) {
            Logger.verbose(`clients 状态需要更新为: ${inspect(needUpdateEntity)}`)
            this.updateOnlineBatch(needUpdateEntity as ClientEntity[])
        } else {
            Logger.verbose(`clients 状态无需更新`)
        }
    }

    onModuleInit(): any {
        this.addCronJob('OnlineCheck', () => this.onlineCheck(), getEnvSetting(EnvKeyEnum.OnlineCheckCron))
    }

    private addCronJob(name: string, task: () => void, interval: string) {
        const job = new CronJob(interval, task, null, null, null, null, true)
        this.schedulerRegistry.addCronJob(name, job)
        job.start()
        Logger.log(`job ${name} added at ${interval}`)
    }

    async register(client: ClientEntity) {
        const registeredClient = await this.clientRepository.findOne({ ip: client.ip })
        return registeredClient ? registeredClient.id : (await this.clientRepository.save(client)).id
    }

    async getById(id: string) {
        return this.clientRepository.findOne(id)
    }

    async getByIp(ip: string) {
        return this.clientRepository.findOne({ ip })
    }

    async findAll() {
        return this.clientRepository.find()
    }

    /**
     * set online status
     * @param id id
     * @param online isOnline
     */
    async setOnline(id: string, online: IsOrNotEnum) {
        return this.clientRepository.update(id, { isOnline: online })
    }

    updateOnlineBatch(updateEntities: ClientEntity[]) {
        return this.clientRepository.save(updateEntities)
    }

    async getRelationshipBetweenPortAndUserId(clientId: string): Promise<UserProperty[]> {
        const streams = await this.streamService.findByClientId(clientId)
        const relations: UserProperty[] = []
        streams?.forEach(s => {
            const relation = relations.find(r => r.userId === s.userId)
            if (relation) {
                if (relation.ports) {
                    relation.ports.push(s.transitPort?.toString())
                } else {
                    relation.ports = [s.transitPort?.toString()]
                }
            } else {
                relations.push({
                    userId: s.userId,
                    ports: [s.transitPort?.toString()]
                })
            }
        })
        return relations
    }
}
