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
     * @param streamEntities Stream[]
     * @returns Stream[]
     */
    streamSave(streamEntities: Stream[]) {
        return this.userRepository.save(streamEntities)
    }

    /**
     * 更新 stream 的 state 状态
     * typeorm + sqlite 无法正确返回 affect rows https://github.com/typeorm/typeorm/issues/7374
     * 2021.10.24 更换为 better-sqlite3, 可以正确返回 affect rows
     * @param id streamID
     * @param state state
     * @returns UpdateResult
     */
    stateUpdate(id: number, state: number) {
        return this.userRepository.update(id, { state: state })
    }

    /**
     * 根据 primary key, streamEntity 更新记录
     * @param id primary key
     * @param streamEntity 只需要包含需要更新的值
     */
    @Preprocess()
    patchStreamById(id: string, @Optimized() streamEntity: Stream) {
        return this.userRepository.update(id, streamEntity)
    }

    @Preprocess()
    async patchAllStream(@Optimized() streamEntities: Stream[]) {
        return Promise.all(streamEntities.map(s => this.patchStreamById(s.id, s)))
    }

    /**
     * 更新 delete_time 字段
     * @param id primary key
     */
    delete(id: string) {
        return this.userRepository.softDelete(id)
    }

    /**
     * 更新所有记录的 delete_time
     * @returns affect rows
     */
    deleteAll() {
        return this.userRepository.createQueryBuilder().update(Stream).set({ deleteTime: new Date() }).where('delete_time is NULL').execute()
    }
}
