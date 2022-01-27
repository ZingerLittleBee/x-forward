import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Log, LogDocument } from '@x-forward/bucket/schemas/log.schema'
import { CreateLogDto } from '@x-forward/bucket/dto/create-log.dto'

@Injectable()
export class BucketService {
    constructor(@InjectModel('Log') private logModel: Model<LogDocument>) {}

    async create(createLogDto: CreateLogDto | CreateLogDto[]): Promise<Log> {
        return this.logModel.create(createLogDto)
    }

    async findAll(): Promise<Log[]> {
        return this.logModel.find().exec()
    }

    async findByTimeRange(startTime: Date, endTime: Date) {
        return this.logModel.find({
            time: { $gte: startTime, $lte: endTime }
        })
    }
}
