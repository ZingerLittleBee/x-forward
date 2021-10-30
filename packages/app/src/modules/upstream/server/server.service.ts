import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Optimized, Preprocess } from 'src/decorators/args.decorator'
import { Repository } from 'typeorm'
import { ServerEntity } from './entities/server.entity'

@Injectable()
export class ServerService {
    constructor(@InjectRepository(ServerEntity) private serverRepository: Repository<ServerEntity>) {}

    create(createServer: ServerEntity[]) {
        return this.serverRepository.save(createServer)
    }

    @Preprocess()
    update(id: string, @Optimized() server: ServerEntity) {
        return this.serverRepository.update(id, server)
    }

    updateAll(servers: ServerEntity[]) {
        return Promise.all(servers.map(s => this.update(s.id, s)))
    }

    remove(id: string) {
        return this.serverRepository.softDelete(id)
    }

    removeByFK(id: string) {
        this.serverRepository.createQueryBuilder().softDelete().from(ServerEntity).where('upstream_id = :id', { id }).execute()
    }
}
