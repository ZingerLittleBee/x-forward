import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LoginUserDto } from './user.dto'
import { UserEntity } from './user.entity'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {}

    async login({ username, password }: LoginUserDto) {
        return this.userRepository.findOne({ username, password })
    }

    async findOne(username: string) {
        return this.userRepository.findOne({ username })
    }

    async findAll(): Promise<UserEntity[]> {
        return this.userRepository.find()
    }

    async create(user: UserEntity) {
        return this.userRepository.save(user)
    }

    createAll(user: UserEntity[]) {
        this.userRepository.save(user)
    }

    async delete(id: string) {
        const { affected } = await this.userRepository.softDelete(id)
        return affected
    }
}
