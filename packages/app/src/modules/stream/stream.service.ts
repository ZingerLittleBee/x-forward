import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../user/user.entity'
import { Stream } from './stream.entity'

@Injectable()
export class StreamService {
    constructor(
        @InjectRepository(Stream)
        private userRepository: Repository<Stream>
    ) {}

    /**
     * 获取所有 stream 规则
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
        const insertRes = await this.userRepository.insert(streamEntitys)
        return insertRes.identifiers
    }

    /**
     * 更新 stream 的 state 状态
     * typeorm + sqlite 无法正确返回 affect rows https://github.com/typeorm/typeorm/issues/7374
     * @param id streamID
     * @param state state
     * @returns 影响行数
     */
    async stateUpdate(id: number, state: number) {
        await this.userRepository.update(id, { state: state })
        let res = await this.userRepository.findOne(id)
        return res.state === state
    }
}
