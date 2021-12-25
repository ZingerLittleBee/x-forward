import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EventService } from '../../event/event.service'
import { ServerEntity } from './entities/server.entity'
import { Optimized, Preprocess } from '../../../decorators/args.decorator'
import { omit } from 'lodash'

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
        if (server.id) {
            server = omit(server, 'id')
        }
        const res = await this.serverRepository.update(id, server)
        this.eventService.triggerUpdateEvent()
        return res
    }

    async updateAll(servers: ServerEntity[]) {
        const updateResults = await Promise.all(
            servers.map(s => {
                if (s.id) {
                    return this.update(s.id, s)
                } else {
                    Promise.reject('id can not empty')
                }
            })
        )
        let affectCount = 0
        updateResults.forEach(u => {
            affectCount += u.affected
        })
        return affectCount
    }

    async remove(id: string) {
        const res = await this.serverRepository.softDelete(id)
        this.eventService.triggerDeleteEvent()
        return res
    }

    async removeByFK(id: string) {
        const removeResult = await this.serverRepository
            .createQueryBuilder()
            .softDelete()
            .from(ServerEntity)
            .where('upstream_id = :id', { id })
            .execute()
        this.eventService.triggerDeleteEvent()
        return removeResult
    }
}
