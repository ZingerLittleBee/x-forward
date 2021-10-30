import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { omit } from 'lodash'
import { Optimized, Preprocess } from 'src/decorators/args.decorator'
import { Repository } from 'typeorm'
import { ServerService } from './server/server.service'
import { UpstreamEntity } from './upstream.entity'

@Injectable()
export class UpstreamService {
    constructor(@InjectRepository(UpstreamEntity) private upstreamRepository: Repository<UpstreamEntity>, private serverService: ServerService) {}

    async create(createUpstream: UpstreamEntity) {
        if (createUpstream.server) {
            await this.serverService.create(createUpstream.server)
        }
        return this.upstreamRepository.save(createUpstream)
    }

    async createAll(createUpstreams: UpstreamEntity[]) {
        return Promise.all(createUpstreams.map(upstream => this.create(upstream)))
    }

    findAll() {
        return this.upstreamRepository.find()
    }

    findByName(name: string) {
        return this.upstreamRepository.findOne({ name: name })
    }

    findOne(id: string) {
        return this.upstreamRepository.findOne(id)
    }

    @Preprocess()
    async update(id: string, @Optimized() updateUpstream: UpstreamEntity) {
        console.log('updateUpstream', updateUpstream)
        if (updateUpstream.server) {
            this.serverService.updateAll(updateUpstream.server)
        }
        return this.upstreamRepository.update(id, omit(updateUpstream, 'server'))
    }

    async remove(id: string) {
        this.serverService.removeByFK(id)
        return this.upstreamRepository.softDelete(id)
    }
}
