import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectRepository } from '@nestjs/typeorm'
import { omit } from 'lodash'
import { Optimized, Preprocess } from 'src/decorators/args.decorator'
import { EventEnum } from 'src/enums/event.enum'
import { eventThrottle } from 'src/utils/event.util'
import { Repository } from 'typeorm'
import { StreamService } from '../stream/stream.service'
import { ServerService } from './server/server.service'
import { UpstreamEntity } from './upstream.entity'

@Injectable()
export class UpstreamService implements OnModuleInit {
    constructor(
        @InjectRepository(UpstreamEntity) private upstreamRepository: Repository<UpstreamEntity>,
        private serverService: ServerService,
        private streamService: StreamService,
        private eventEmitter: EventEmitter2
    ) {}

    triggerCreateEvent: Function

    private initEvent() {
        this.triggerCreateEvent = eventThrottle(this.eventEmitter, EventEnum.CONFIG_CREATED, 5000)
        Logger.verbose(`${EventEnum.CONFIG_CREATED} registered`)
    }

    onModuleInit() {
        this.initEvent()
    }

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
        Logger.verbose(`${EventEnum.CONFIG_CREATED} triggered`)
        let upstreamEntity = await this.upstreamRepository.save(upstream)
        // just for test
        this.triggerCreateEvent ? this.triggerCreateEvent() : (this.initEvent(), this.triggerCreateEvent())
        return upstreamEntity
    }

    async createAll(upstreams: UpstreamEntity[]) {
        return Promise.all(upstreams.map(upstream => this.create(upstream)))
    }

    findAll() {
        return this.upstreamRepository.find()
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
        return this.upstreamRepository.update(id, omit(updateUpstream, 'server', 'stream'))
    }

    async remove(id: string) {
        this.serverService.removeByFK(id)
        return this.upstreamRepository.softDelete(id)
    }
}
