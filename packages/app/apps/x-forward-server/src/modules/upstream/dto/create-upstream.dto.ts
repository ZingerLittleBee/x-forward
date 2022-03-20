import { AutoMap } from '@automapper/classes'
import { PickType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { CreateServerDto } from '../../server/dto/create-server.dto'
import { CreateStreamDto } from '../../stream/dto/create-stream.dto'
import { UpstreamEntity } from '../entity/upstream.entity'

export class CreateUpstreamDto extends PickType(UpstreamEntity, ['clientId', 'name', 'loadBalancing']) {
    @AutoMap()
    clientId?: string

    @ValidateNested({ each: true })
    @Type(() => CreateStreamDto)
    @AutoMap({ typeFn: () => CreateStreamDto })
    stream: CreateStreamDto[]

    @ValidateNested({ each: true })
    @Type(() => CreateServerDto)
    @AutoMap({ typeFn: () => CreateServerDto })
    server: CreateServerDto[]
}
