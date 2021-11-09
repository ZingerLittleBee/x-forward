import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Optimized, Preprocess } from 'src/decorators/args.decorator'
import { EventService } from 'src/modules/event/event.service'
import { Repository } from 'typeorm'
import { ServerEntity } from './entities/server.entity'

@Injectable()
export class ServerService {
    constructor(@InjectRepository(ServerEntity) private serverRepository: Repository<ServerEntity>, private readonly eventService: EventService) {}

    async createAll(createServer: ServerEntity[]) {
        let res = await this.serverRepository.save(createServer)
        this.eventService.triggerCreateEvent()
        return res
    }

    @Preprocess()
    async update(id: string, @Optimized() server: ServerEntity) {
        let res = await this.serverRepository.update(id, server)
        this.eventService.triggerUpdateEvent()
        return res
    }

    updateAll(servers: ServerEntity[]) {
        return Promise.all(servers.map(s => this.update(s.id, s)))
    }

    async remove(id: string) {
        let res = await this.serverRepository.softDelete(id)
        this.eventService.triggerDeleteEvent()
        return res
    }

    async removeByFK(id: string) {
        await this.serverRepository.createQueryBuilder().softDelete().from(ServerEntity).where('upstream_id = :id', { id }).execute()
        this.eventService.triggerDeleteEvent()
    }
}
