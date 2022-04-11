import { StateEnum } from '@forwardx/shared'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Optimized, Preprocess } from '@x-forward/common'
import { Repository } from 'typeorm'
import { EventService } from '../event/event.service'
import { ServerService } from '../server/server.service'
import { StreamEntity } from '../stream/entity/stream.entity'
import { StreamService } from '../stream/stream.service'
import { UpstreamEntity } from './entity/upstream.entity'

@Injectable()
export class UpstreamService {
    constructor(
        @InjectRepository(UpstreamEntity) private upstreamRepository: Repository<UpstreamEntity>,
        private serverService: ServerService,
        private streamService: StreamService,
        private eventService: EventService
    ) {}

    @Preprocess()
    async create(@Optimized() upstream: UpstreamEntity) {
        // trigger event
        const upstreamEntity = await this.upstreamRepository.save(upstream)
        if (upstream?.clientId) this.eventService.triggerCreateEvent({ clientId: upstream.clientId })
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
        if (upstreams[0]?.clientId) this.eventService.triggerCreateEvent({ clientId: upstreams[0].clientId })
        return res
    }

    async findAll(clientId: string) {
        return this.upstreamRepository.find({
            where: { clientId },
            relations: ['server']
        })
    }

    async findAllWithoutEager(clientId: string | undefined) {
        return clientId
            ? this.upstreamRepository
                  .createQueryBuilder()
                  .select('upstream')
                  .from(UpstreamEntity, 'upstream')
                  .where(qb => {
                      const subQuery = qb
                          .subQuery()
                          .select('stream.upstream_id')
                          .from(StreamEntity, 'stream')
                          .where('stream.client_id = :clientId')
                          .getQuery()
                      return 'upstream.id IN' + subQuery
                  })
                  .setParameter('clientId', clientId)
                  .leftJoinAndSelect('upstream.server', 'server')
                  .getMany()
            : this.upstreamRepository
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

    async getClientIdById(id: string) {
        return (await this.upstreamRepository.findOne({ id }))?.clientId
    }

    @Preprocess()
    async update(@Optimized() updateUpstream: UpstreamEntity) {
        const res = await this.upstreamRepository.save(updateUpstream)
        const clientId = await this.getClientIdById(updateUpstream.id)
        if (clientId) this.eventService.triggerUpdateEvent({ clientId })
        return res
    }

    async remove(id: string) {
        const clientId = await this.getClientIdById(id)
        await this.serverService.removeByFK(id)
        const res = await this.upstreamRepository.delete(id)
        // need delete associated fk
        await this.streamService.removeByFK(id)
        await this.serverService.removeByFK(id)
        if (clientId) this.eventService.triggerDeleteEvent({ clientId })
        return res
    }
}
