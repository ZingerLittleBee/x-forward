import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CreateLogDto } from '@x-forward/bucket/dto/create-log.dto'
import { Log, LogDocument } from '@x-forward/bucket/schemas/log.schema'
import { Model } from 'mongoose'

@Injectable()
export class BucketService {
    constructor(@InjectModel('Log') private logModel: Model<LogDocument>) {}

    async create(createLogDto: CreateLogDto | CreateLogDto[]): Promise<Log> {
        return this.logModel.create(createLogDto)
    }

    async findAll(): Promise<Log[]> {
        return this.logModel.find().exec()
    }

    async findByTimeRange(startTime: Date, endTime: Date): Promise<Log[]> {
        return this.logModel.find({
            time: { $gte: startTime, $lte: endTime }
        })
    }

    async getLastTimeByClientId(clientId: string): Promise<Log> {
        return this.logModel
            .findOne({
                client_id: clientId
            })
            .sort({ time: -1 })
            .limit(1)
    }
}
