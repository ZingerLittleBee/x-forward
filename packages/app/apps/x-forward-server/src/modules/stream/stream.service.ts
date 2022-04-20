import { StateEnum } from '@forwardx/shared'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Optimized, Preprocess } from '@x-forward/common'
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
        const res = await this.streamRepository.save(streamEntity)
        if (streamEntity?.clientId) this.eventService.triggerCreateEvent({ clientId: streamEntity.clientId })
        return res
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
    async upstreamIdUpdate(id: string, upstreamId: string) {
        const res = await this.streamRepository.update(id, { upstreamId })
        const clientId = await this.getClientIdById(id)
        if (clientId) this.eventService.triggerCreateEvent({ clientId })
        return res
    }

    async getClientIdById(id: string) {
        return (await this.streamRepository.findOne(id))?.clientId
    }

    @Preprocess()
    async update(id: string, @Optimized() streamEntity: StreamEntity) {
        const res = await this.streamRepository.update(id, streamEntity)
        const clientId = await this.getClientIdById(id)
        if (clientId) this.eventService.triggerUpdateEvent({ clientId })
        return res
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
     * 更新 stream 的 state 状态
     * typeorm + sqlite 无法正确返回 affect rows https://github.com/typeorm/typeorm/issues/7374
     * 2021.10.24 更换为 better-sqlite3, 可以正确返回 affect rows
     * @param id streamID
     * @param state state
     * @returns UpdateResult
     */
    async stateUpdate(id: string, state: number) {
        const res = await this.streamRepository.update(id, { state: state })
        const clientId = await this.getClientIdById(id)
        if (clientId) this.eventService.triggerUpdateEvent({ clientId })
        return res
    }

    async updateStateByClientId(clientId: string, state: StateEnum) {
        this.eventService.triggerBatchRestart({})
        return this.streamRepository.update({ clientId }, { state })
    }

    async updateAllState(state: StateEnum) {
        this.eventService.triggerBatchRestart({})
        return this.streamRepository.createQueryBuilder().update().set({ state }).where('id IS NOT NULL').execute()
    }

    async restartAll(clientId?: string) {
        this.eventService.triggerBatchRestart({ clientId })
    }

    async startAll(clientId?: string) {
        return clientId ? this.updateStateByClientId(clientId, StateEnum.Able) : this.updateAllState(StateEnum.Able)
    }

    async stopAll(clientId?: string) {
        return clientId
            ? this.updateStateByClientId(clientId, StateEnum.Disable)
            : this.updateAllState(StateEnum.Disable)
    }

    /**
     * 更新 delete_time 字段
     * @param id primary key
     */
    async delete(id: string) {
        const clientId = await this.getClientIdById(id)
        const res = await this.streamRepository.delete(id)
        if (clientId) this.eventService.triggerDeleteEvent({ clientId })
        return res
    }

    async deleteAll(clientId?: string) {
        this.eventService.triggerBatchDelete({ clientId })
        return clientId
            ? this.streamRepository.delete({ clientId })
            : this.streamRepository.createQueryBuilder().delete().from(StreamEntity).where('id IS NOT NULL').execute()
    }

    /**
     * 更新所有记录的 delete_time
     * @returns affect rows
     */
    // async deleteAll(clientId: string) {
    //     const res = await this.streamRepository
    //         .createQueryBuilder()
    //         .update(StreamEntity)
    //         .set({ deleteTime: new Date() })
    //         .where('delete_time is NULL')
    //         .execute()
    //     this.eventService.triggerDeleteEvent({ clientId })
    //     return res
    // }

    async removeByFK(id: string) {
        const clientId = await this.getClientIdById(id)
        const res = await this.streamRepository
            .createQueryBuilder()
            .delete()
            .from(StreamEntity)
            .where('upstream_id = :id', { id })
            .execute()
        if (clientId) this.eventService.triggerDeleteEvent({ clientId })
        return res
    }
}
