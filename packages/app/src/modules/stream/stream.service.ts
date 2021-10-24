import { InjectMapper } from '@automapper/nestjs'
import { Mapper } from '@automapper/types'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Optimized, Preprocess } from 'src/decorators/args.decorator'
import { Repository } from 'typeorm'
import { Stream } from './stream.entity'

@Injectable()
export class StreamService {
    constructor(
        @InjectRepository(Stream)
        private userRepository: Repository<Stream>,
        @InjectMapper() private blahMapper: Mapper
    ) {}

    /**
     * 获取所有 stream 规则
     * 排除 delete_time 不为空的记录
     * @returns Stream[]
     */
    streamList(): Promise<Stream[]> {
        return this.userRepository.find()
    }

    /**
     * 添加 stream 规则
     * @param streamEntitys Stream[]
     * @returns 插入的 id
     */
    async streamAdd(streamEntitys: Stream[]) {
        const { identifiers } = await this.userRepository.insert(streamEntitys)
        return identifiers
    }

    /**
     * 更新 stream 的 state 状态
     * typeorm + sqlite 无法正确返回 affect rows https://github.com/typeorm/typeorm/issues/7374
     * 2021.10.24 更换为 better-sqlite3, 可以正确返回 affect rows
     * @param id streamID
     * @param state state
     * @returns 影响行数
     */
    async stateUpdate(id: number, state: number) {
        return (await this.userRepository.update(id, { state: state })).affected
    }

    /**
     * 根据 primary key, streamEntity 更新记录
     * @param id primary key
     * @param streamEntity 只需要包含需要更新的值
     */
    @Preprocess()
    async patchStreamById(id: string, @Optimized() streamEntity: Stream) {
        return (await this.userRepository.update(id, streamEntity)).affected
    }

    /**
     * 更新 delete_time 字段
     * @param id primary key
     */
    async updateDeletetimeById(id: string) {
        return (await this.userRepository.update(id, { deleteTime: new Date() })).affected
    }

    /**
     * 更新所有记录的 delete_time
     * @returns affect rows
     */
    async updateDeletetime() {
        return (await this.userRepository.createQueryBuilder().update(Stream).set({ deleteTime: new Date() }).where('delete_time is NULL').execute()).affected
    }
}
