import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ClientEntity } from './entity/client.entity'

export class ClientService {
    constructor(
        @InjectRepository(ClientEntity)
        private clientRepository: Repository<ClientEntity>
    ) {}

    async register(client: ClientEntity) {
        return this.clientRepository.save(client)
    }

    async getById(id: string) {
        return this.clientRepository.findOne(id)
    }
}
