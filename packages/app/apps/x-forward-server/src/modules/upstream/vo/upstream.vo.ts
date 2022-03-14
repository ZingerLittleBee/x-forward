import { PickType } from '@nestjs/swagger'
import { UpstreamEntity } from '../entity/upstream.entity'

export class UpstreamVo extends PickType(UpstreamEntity, [
    'id',
    'state',
    'name',
    'loadBalancing',
    'server',
    'createTime',
    'updateTime'
]) {}
