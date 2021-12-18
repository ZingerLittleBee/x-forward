import { AutoMap } from '@automapper/classes'
import { PickType } from '@nestjs/swagger'
import { CreateStreamDto } from '../stream/create-stream.dto'
import { CreateServerDto } from './server/dto/create-server.dto'
import { UpstreamEntity } from './upstream.entity'

export class CreateUpstreamDto extends PickType(UpstreamEntity, ['name', 'loadBalancing']) {
    @AutoMap({ typeFn: () => CreateStreamDto })
    stream: CreateStreamDto[]

    @AutoMap({ typeFn: () => CreateServerDto })
    server: CreateServerDto[]
}
