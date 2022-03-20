import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Optimized, Preprocess, StateEnum } from '@x-forward/common'
import { Repository } from 'typeorm'
import { EventService } from '../event/event.service'
import { StreamEntity } from './entity/stream.entity'

@Injectable()
export class StreamService {
    constructor(
        @InjectRepository(StreamEntity)
        private streamRepository: Repository<StreamEntity>,
        private readonly eventService: EventService
    ) {}

    /**
     * 获取所有 stream 规则
     * 排除 delete_time 不为空的记录
     * @returns StreamEntity[]
     */
    async findAll(): Promise<StreamEntity[]> {
        return this.streamRepository.find({ loadRelationIds: true })
    }

    async findById(id: string) {
        return this.streamRepository.findOne(id, { loadRelationIds: true })
    }

    async findByUserId(userId: string) {
        return this.streamRepository.find({ userId })
    }

    async findByClientId(clientId: string) {
        return this.streamRepository.find({
            where: { clientId },
            loadRelationIds: true
        })
    }

    /**
     * find record which fk is null
     * @returns StreamEntity[]
     */
    async findNullFK() {
        return this.streamRepository
            .createQueryBuilder()
            .select('stream')
            .from(StreamEntity, 'stream')
            .where('stream.upstream_id IS NULL')
            .andWhere('stream.state = :state', { state: StateEnum.Able })
            .getMany()
    }

    /**
     * 添加 stream 规则
     * @param streamEntity Stream
     * @returns StreamEntity
     */
    @Preprocess()
    async create(@Optimized() streamEntity: StreamEntity) {
        return this.streamRepository.save(streamEntity)
        // await this.streamRepository
        //     .createQueryBuilder()
        //     .relation(StreamEntity, 'clientId')
        //     .of(res.id)
        //     .add(streamEntity?.clientId)
        // return await this.streamRepository
        //     .createQueryBuilder()
        //     .insert()
        //     .into(StreamEntity)
        //     .values([streamEntity])
        //     .execute()
        // this.eventService.triggerCreateEvent({ clientId: streamEntity?.clientId })
    }

    /**
     * 批量添加 stream 规则
     * @param streamEntities Stream[]
     * @returns StreamEntity[]
     */
    async createAll(streamEntities: StreamEntity[]) {
        const res = await this.streamRepository.save(streamEntities)
        // create only execute in same client
        // this.eventService.triggerCreateEvent({ clientId: streamEntities?.[0]?.clientId })
        return res
    }

    /**
     * 更新 upstreamId
     * @param id StreamId
     * @param upstreamId upstreamId
     */
    upstreamIdUpdate(id: string, upstreamId: string) {
        return this.streamRepository.update(id, { upstreamId: upstreamId })
    }

    /**
     * 更新 stream 的 state 状态
     * typeorm + sqlite 无法正确返回 affect rows https://github.com/typeorm/typeorm/issues/7374
     * 2021.10.24 更换为 better-sqlite3, 可以正确返回 affect rows
     * @param id streamID
     * @param state state
     * @returns UpdateResult
     */
    stateUpdate(id: string, state: number) {
        return this.streamRepository.update(id, { state: state })
    }

    @Preprocess()
    async update(id: string, @Optimized() streamEntity: StreamEntity) {
        return this.streamRepository.update(id, streamEntity)
    }

    async updateAll(streamEntities: StreamEntity[]) {
        let createNum = 0
        const updateResults = await Promise.all(
            streamEntities.map(s => {
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

    /**
     * 更新 delete_time 字段
     * @param id primary key
     */
    async delete(id: string) {
        const res = await this.streamRepository.softDelete(id)
        // this.eventService.triggerDeleteEvent({ clientId: (await this.streamRepository.findOne(id))?.clientId })
        return res
    }

    /**
     * 更新所有记录的 delete_time
     * @returns affect rows
     */
    async deleteAll(clientId: string) {
        const res = await this.streamRepository
            .createQueryBuilder()
            .update(StreamEntity)
            .set({ deleteTime: new Date() })
            .where('delete_time is NULL')
            .execute()
        this.eventService.triggerDeleteEvent({ clientId })
        return res
    }

    async removeByFK(id: string) {
        const res = await this.streamRepository
            .createQueryBuilder()
            .softDelete()
            .from(StreamEntity)
            .where('upstream_id = :id', { id })
            .execute()
        // this.eventService.triggerDeleteEvent({ clientId: (await this.streamRepository.findOne(id))?.clientId })
        return res
    }
}
