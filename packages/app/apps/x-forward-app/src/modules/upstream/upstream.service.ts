import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { omit } from 'lodash'
import { Repository } from 'typeorm'
import { Optimized, Preprocess } from '../../decorators/args.decorator'
import { EventEnum } from '../../enums/event.enum'
import { StateEnum } from '../../enums/StatusEnum'
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
        const upstreamEntity = await this.upstreamRepository.save(upstream)
        this.eventService.triggerCreateEvent()
        Logger.verbose(`${EventEnum.CONFIG_CREATE} triggered`)
        return upstreamEntity
    }

    async createAll(upstreams: UpstreamEntity[]) {
        // if I use `Promise.all` like next line, will get an error that QueryFailedError: SqliteError: cannot start a transaction within a transaction from sqlite
        // return Promise.all(upstreams.map(upstream => this.create(upstream)))
        const res = []
        for (let i = 0; i < upstreams.length; i++) {
            const createRes = await this.create(upstreams[i])
            res.push(createRes)
        }
        return res
    }

    async findAll() {
        return this.upstreamRepository.find()
    }

    async findAllWithoutEager() {
        return this.upstreamRepository
            .createQueryBuilder()
            .select('upstream')
            .from(UpstreamEntity, 'upstream')
            .leftJoinAndSelect('upstream.server', 'server')
            .getMany()
    }

    async findEffect() {
        return this.upstreamRepository.find({ state: StateEnum.Able })
    }

    async findByName(name: string) {
        return this.upstreamRepository.findOne({ name })
    }

    async findByNames(names: string[]) {
        return names.map(n => this.findByName(n)).filter(n => n)
    }

    async findOne(id: string) {
        return this.upstreamRepository.findOne(id)
    }

    @Preprocess()
    async update(id: string, @Optimized() updateUpstream: UpstreamEntity) {
        if (updateUpstream.server) {
            await this.serverService.updateAll(updateUpstream.server)
        }
        if (updateUpstream.stream) {
            await this.streamService.updateAll(updateUpstream.stream)
        }
        const res = await this.upstreamRepository.update(id, omit(updateUpstream, 'server', 'stream'))
        this.eventService.triggerUpdateEvent()
        Logger.verbose(`${EventEnum.CONFIG_UPDATE} triggered`)
        return res
    }

    async remove(id: string) {
        await this.serverService.removeByFK(id)
        const res = await this.upstreamRepository.softDelete(id)
        this.eventService.triggerDeleteEvent()
        Logger.verbose(`${EventEnum.CONFIG_DELETE} triggered`)
        return res
    }
}
