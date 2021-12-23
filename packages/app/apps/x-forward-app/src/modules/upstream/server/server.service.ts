import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EventService } from '../../event/event.service'
import { ServerEntity } from './entities/server.entity'
import { Optimized, Preprocess } from '../../../decorators/args.decorator'

@Injectable()
export class ServerService {
    constructor(
        @InjectRepository(ServerEntity) private serverRepository: Repository<ServerEntity>,
        private readonly eventService: EventService
    ) {}

    async createAll(createServer: ServerEntity[]) {
        const res = await this.serverRepository.save(createServer)
        this.eventService.triggerCreateEvent()
        return res
    }

    @Preprocess()
    async update(id: string, @Optimized() server: ServerEntity) {
        const res = await this.serverRepository.update(id, server)
        this.eventService.triggerUpdateEvent()
        return res
    }

    async updateAll(servers: ServerEntity[]) {
        return Promise.all(
            servers.map(s => {
                if (s.id) {
                    return this.update(s.id, s)
                } else {
                    Promise.reject('id can not empty')
                }
            })
        )
    }

    async remove(id: string) {
        const res = await this.serverRepository.softDelete(id)
        this.eventService.triggerDeleteEvent()
        return res
    }

    async removeByFK(id: string) {
        await this.serverRepository
            .createQueryBuilder()
            .softDelete()
            .from(ServerEntity)
            .where('upstream_id = :id', { id })
            .execute()
        this.eventService.triggerDeleteEvent()
    }
}
