import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Optimized, Preprocess } from 'src/decorators/args.decorator'
import { Repository } from 'typeorm'
import { StreamEntity } from './stream.entity'

@Injectable()
export class StreamService {
    constructor(
        @InjectRepository(StreamEntity)
        private streamRepository: Repository<StreamEntity>
    ) {}

    /**
     * 获取所有 stream 规则
     * 排除 delete_time 不为空的记录
     * @returns StreamEntity[]
     */
    async findAll(): Promise<StreamEntity[]> {
        return this.streamRepository.find({ loadRelationIds: true })
    }

    /**
     * find record which fk is null
     * @returns StreamEntity[]
     */
    async findNullFK() {
        return this.streamRepository.createQueryBuilder().select('stream').from(StreamEntity, 'stream').where('stream_upstream_id IS NULL').getMany()
    }

    /**
     * 添加 stream 规则
     * @param streamEntity Stream
     * @returns StreamEntity
     */
    async create(streamEntity: StreamEntity) {
        return await this.streamRepository.save(streamEntity)
    }

    /**
     * 批量添加 stream 规则
     * @param streamEntities Stream[]
     * @returns StreamEntity[]
     */
    async createAll(streamEntities: StreamEntity[]) {
        return await this.streamRepository.save(streamEntities)
    }

    // /**
    //  * 添加 stream 规则
    //  * @param streamEntities StreamEntity[]
    //  * @returns StreamEntity[]
    //  */
    // async streamSaveAll(streamEntities: StreamEntity[]) {
    //     return Promise.all(streamEntities.map(s => this.create(s)))
    //     // let upstreams = streamEntities.map(s => s.upstream).filter(s => s)
    //     // if (upstreams) {
    //     //     console.log('upstreams', upstreams)
    //     //     this.upstreamService.createAll(upstreams)
    //     // }
    //     // const res = await this.userRepository.save(streamEntities)
    //     // this.eventEmitter.emit(EventEnum.CONFIG_CREATED, res)
    //     // return res
    // }

    /**
     * 更新 stream 的 state 状态
     * typeorm + sqlite 无法正确返回 affect rows https://github.com/typeorm/typeorm/issues/7374
     * 2021.10.24 更换为 better-sqlite3, 可以正确返回 affect rows
     * @param id streamID
     * @param state state
     * @returns UpdateResult
     */
    stateUpdate(id: number, state: number) {
        return this.streamRepository.update(id, { state: state })
    }

    @Preprocess()
    update(id: string, @Optimized() streamEntity: StreamEntity) {
        return this.streamRepository.update(id, streamEntity)
    }

    updateAll(streamEntities: StreamEntity[]) {
        return streamEntities.map(s => this.update(s.id, s))
    }

    /**
     * 根据 primary key, streamEntity 更新记录
     * @param id primary key
     * @param streamEntity 只需要包含需要更新的值
     */
    @Preprocess()
    patchStreamById(id: string, @Optimized() streamEntity: StreamEntity) {
        return this.streamRepository.update(id, streamEntity)
    }

    @Preprocess()
    async patchAllStream(@Optimized() streamEntities: StreamEntity[]) {
        return Promise.all(streamEntities.map(s => this.patchStreamById(s.id, s)))
    }

    /**
     * 更新 delete_time 字段
     * @param id primary key
     */
    delete(id: string) {
        return this.streamRepository.softDelete(id)
    }

    /**
     * 更新所有记录的 delete_time
     * @returns affect rows
     */
    deleteAll() {
        return this.streamRepository.createQueryBuilder().update(StreamEntity).set({ deleteTime: new Date() }).where('delete_time is NULL').execute()
    }

    removeByFK(id: string) {
        this.streamRepository.createQueryBuilder().softDelete().from(StreamEntity).where('upstream_id = :id', { id }).execute()
    }
}
