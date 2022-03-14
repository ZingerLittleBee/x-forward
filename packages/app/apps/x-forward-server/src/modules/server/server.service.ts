import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Optimized, Preprocess } from '@x-forward/common'
import { omit } from 'lodash'
import { Repository } from 'typeorm'
import { EventService } from '../event/event.service'
import { ServerEntity } from './entity/server.entity'

@Injectable()
export class ServerService {
    constructor(
        @InjectRepository(ServerEntity) private serverRepository: Repository<ServerEntity>,
        private readonly eventService: EventService
    ) {}

    async createAll(createServer: ServerEntity[]) {
        return this.serverRepository.save(createServer)
    }

    @Preprocess()
    async update(id: string, @Optimized() server: ServerEntity) {
        if (server.id) {
            server = omit(server, 'id')
        }
        const res = await this.serverRepository.update(id, server)
        return res
    }

    async updateAll(servers: ServerEntity[]) {
        let createNum = 0
        const updateResults = await Promise.all(
            servers.map(s => {
                if (s.id) {
                    return this.update(s.id, s)
                } else {
                    this.createAll([s])
                    createNum++
                }
            })
        )
        let affectCount = 0
        updateResults?.forEach(u => {
            affectCount += u.affected
        })
        return affectCount + createNum
    }

    async remove(id: string) {
        const res = await this.serverRepository.softDelete(id)
        return res
    }

    async removeByFK(id: string) {
        const removeResult = await this.serverRepository
            .createQueryBuilder()
            .softDelete()
            .from(ServerEntity)
            .where('upstream_id = :id', { id })
            .execute()
        return removeResult
    }
}
