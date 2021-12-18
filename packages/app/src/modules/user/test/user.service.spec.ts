import { Test } from '@nestjs/testing'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { Repository } from 'typeorm/repository/Repository'
import { UserEntity } from '../user.entity'
import { UserService } from '../user.service'

describe('UserService', () => {
    let userService: UserService
    let repository: Repository<UserEntity>

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'better-sqlite3',
                    database: '../../../../x-forward.db',
                    entities: [UserEntity],
                    autoLoadEntities: true,
                    synchronize: true,
                    logging: true,
                    keepConnectionAlive: true
                }),
                TypeOrmModule.forFeature([UserEntity])
            ],
            providers: [UserService]
        }).compile()
        repository = moduleRef.get<Repository<UserEntity>>(getRepositoryToken(UserEntity))
        userService = moduleRef.get<UserService>(UserService)
    })

    afterEach(() => {
        repository.clear()
    })

    const user: UserEntity = {
        username: 'zhangsan',
        password: 'password'
    }

    describe('create', () => {
        it('UserService.create fail', async () => {
            await userService.create(user)
            expect(await userService.findAll()).toHaveLength(1)
        })
    })
})
