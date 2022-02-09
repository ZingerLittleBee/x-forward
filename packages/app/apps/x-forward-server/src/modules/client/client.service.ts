import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ClientEntity } from './entity/client.entity'
import { IsOrNotEnum } from '@x-forward/shared'
import { Logger, OnModuleInit } from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron'
import { EnvKeyEnum, getEnvSetting } from '@x-forward/common'

export class ClientService implements OnModuleInit {
    constructor(
        @InjectRepository(ClientEntity)
        private clientRepository: Repository<ClientEntity>,
        private schedulerRegistry: SchedulerRegistry
    ) {}

    onModuleInit(): any {
        this.addOnlineCheckCronJob('OnlineCheck', getEnvSetting(''))
    }

    private addOnlineCheckCronJob(name: string, seconds: string) {
        const job = new CronJob(getEnvSetting(EnvKeyEnum.OnlineCheckCron), () => {
            Logger.log(`time (${seconds}) for job ${name} to run!`)
        })

        this.schedulerRegistry.addCronJob(name, job)
        job.start()
        Logger.log(`job ${name} added for each minute at ${seconds} seconds!`)
    }

    async register(client: ClientEntity) {
        return this.clientRepository.save(client)
    }

    async getById(id: string) {
        return this.clientRepository.findOne(id)
    }

    /**
     * set online status
     * @param id id
     * @param online isOnline
     */
    async setOnline(id: string, online: IsOrNotEnum) {
        return this.clientRepository.update(id, { isOnline: online })
    }
}
