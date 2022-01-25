import { PartialType } from '@nestjs/swagger'
import { Log } from '@x-forward/bucket/schemas/log.schema'

export class CreateLogDto extends PartialType(Log) {}
