import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Stream } from './stream.entity'

@Injectable()
export class StreamService {
    constructor(
        @InjectRepository(Stream)
        private userRepository: Repository<Stream>
    ) {}

    streamList(): Promise<Stream[]> {
        return this.userRepository.find()
    }
}
