import { AutoMap } from '@automapper/classes'
import { PickType } from '@nestjs/swagger'
import { CreateStreamDto } from '../../stream/dto/create-stream.dto'
import { CreateServerDto } from '../../server/dto/create-server.dto'
import { UpstreamEntity } from '../entity/upstream.entity'
import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateUpstreamDto extends PickType(UpstreamEntity, ['name', 'loadBalancing']) {
    @ValidateNested({ each: true })
    @Type(() => CreateStreamDto)
    @AutoMap({ typeFn: () => CreateStreamDto })
    stream: CreateStreamDto[]

    @ValidateNested({ each: true })
    @Type(() => CreateServerDto)
    @AutoMap({ typeFn: () => CreateServerDto })
    server: CreateServerDto[]
}
