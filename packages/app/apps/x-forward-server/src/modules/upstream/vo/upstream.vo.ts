import { PartialType } from '@nestjs/swagger'
import { Entity } from 'typeorm'
import { UpstreamEntity } from '../entity/upstream.entity'

@Entity('upstream')
export class UpstreamVo extends PartialType(UpstreamEntity) {}
