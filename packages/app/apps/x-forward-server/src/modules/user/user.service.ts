import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RoleEnum } from '@x-forward/shared'
import { Repository } from 'typeorm'
import { LoginUserDto } from './user.dto'
import { UserEntity } from './user.entity'

@Injectable()
export class UserService implements OnModuleInit {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {}
    onModuleInit() {
        this.setDefaultUser()
    }

    async login({ username, password }: LoginUserDto) {
        return this.userRepository.findOne({ username, password })
    }

    private readonly defaultUsers: UserEntity[] = [
        {
            role: RoleEnum.Admin,
            username: 'admin',
            password: 'admin'
        },
        {
            role: RoleEnum.User,
            username: 'user',
            password: 'user'
        }
    ]

    private async setDefaultUser() {
        const users = await this.userRepository.find()
        if (users?.length === 0) {
            Logger.log('不存在用户, 将创建默认用户')
            this.userRepository.save(this.defaultUsers)
            return
        }
        Logger.verbose('系统存在有效用户, 无需创建默认用户')
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
        const { affected } = await this.userRepository.delete(id)
        return affected
    }
}
