import { PartialType } from '@nestjs/swagger'
import { Entity } from 'typeorm'
import { UpstreamEntity } from './upstream.entity'

@Entity('upstream')
export class UpstreamVo extends PartialType(UpstreamEntity) {}
