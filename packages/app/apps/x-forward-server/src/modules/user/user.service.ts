import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RoleEnum } from '@x-forward/shared'
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

    // async findOne(username: string) {
    //     return this.userRepository.findOne({ username })
    // }

    private readonly users = [
        {
            userId: 1,
            role: RoleEnum.User,
            username: 'john',
            password: 'changeme'
        },
        {
            userId: 2,
            role: RoleEnum.Admin,
            username: 'maria',
            password: 'guess'
        }
    ]

    async findOne(username: string): Promise<UserEntity | undefined> {
        return this.users.find(user => user.username === username)
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
