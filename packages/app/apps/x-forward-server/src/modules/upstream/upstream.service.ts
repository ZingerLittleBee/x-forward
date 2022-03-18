import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EventEnum, Optimized, Preprocess, StateEnum } from '@x-forward/common'
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

    async create(upstream: UpstreamEntity) {
        // // server - foreign key
        // if (upstream.server) {
        //     await this.serverService.createAll(upstream.server)
        // }
        // // stream - foreign key
        // if (upstream.stream) {
        //     await this.streamService.createAll(upstream.stream)
        // }
        // trigger event
        const upstreamEntity = await this.upstreamRepository.save(upstream)
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

    @Preprocess()
    async update(@Optimized() updateUpstream: UpstreamEntity) {
        // if (updateUpstream.server) {
        //     await this.serverService.updateAll(updateUpstream.server)
        // }
        // if (updateUpstream.stream) {
        //     await this.streamService.updateAll(updateUpstream.stream)
        // }
        // const res = await this.upstreamRepository.update(id, omit(updateUpstream, 'server', 'stream'))
        // Logger.verbose(`${EventEnum.CONFIG_UPDATE} triggered`)
        // return res
        return this.upstreamRepository.save(updateUpstream)
    }

    async remove(id: string) {
        await this.serverService.removeByFK(id)
        const res = await this.upstreamRepository.softDelete(id)
        // need delete associated fk
        await this.streamService.removeByFK(id)
        await this.serverService.removeByFK(id)
        Logger.verbose(`${EventEnum.CONFIG_DELETE} triggered`)
        return res
    }
}
