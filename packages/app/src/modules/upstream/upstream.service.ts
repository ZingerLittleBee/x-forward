import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { omit } from 'lodash'
import { Optimized, Preprocess } from 'src/decorators/args.decorator'
import { EventEnum } from 'src/enums/event.enum'
import { StateEnum } from 'src/enums/StatusEnum'
import { Repository } from 'typeorm'
import { EventService } from '../event/event.service'
import { StreamService } from '../stream/stream.service'
import { ServerService } from './server/server.service'
import { UpstreamEntity } from './upstream.entity'

@Injectable()
export class UpstreamService {
    constructor(
        @InjectRepository(UpstreamEntity) private upstreamRepository: Repository<UpstreamEntity>,
        private serverService: ServerService,
        private streamService: StreamService,
        private eventService: EventService
    ) {}

    async create(upstream: UpstreamEntity) {
        // server - foreign key
        if (upstream.server) {
            await this.serverService.createAll(upstream.server)
        }
        // stream - foreign key
        if (upstream.stream) {
            await this.streamService.createAll(upstream.stream)
        }
        // trigger event
        let upstreamEntity = await this.upstreamRepository.save(upstream)
        this.eventService.triggerCreateEvent()
        Logger.verbose(`${EventEnum.CONFIG_CREATE} triggered`)
        return upstreamEntity
    }

    async createAll(upstreams: UpstreamEntity[]) {
        return Promise.all(upstreams.map(upstream => this.create(upstream)))
    }

    findAll() {
        return this.upstreamRepository.find()
    }

    findEffect() {
        return this.upstreamRepository.find({ state: StateEnum.Able })
    }

    findByName(name: string) {
        return this.upstreamRepository.findOne({ name })
    }

    findByNames(names: string[]) {
        return names.map(n => this.findByName(n)).filter(n => n)
    }

    findOne(id: string) {
        return this.upstreamRepository.findOne(id)
    }

    @Preprocess()
    async update(id: string, @Optimized() updateUpstream: UpstreamEntity) {
        if (updateUpstream.server) {
            this.serverService.updateAll(updateUpstream.server)
        }
        if (updateUpstream.stream) {
            this.streamService.updateAll(updateUpstream.stream)
        }
        let res = await this.upstreamRepository.update(id, omit(updateUpstream, 'server', 'stream'))
        this.eventService.triggerUpdateEvent()
        Logger.verbose(`${EventEnum.CONFIG_UPDATE} triggered`)
        return res
    }

    async remove(id: string) {
        this.serverService.removeByFK(id)
        let res = await this.upstreamRepository.softDelete(id)
        this.eventService.triggerDeleteEvent()
        Logger.verbose(`${EventEnum.CONFIG_DELETE} triggered`)
        return res
    }
}
