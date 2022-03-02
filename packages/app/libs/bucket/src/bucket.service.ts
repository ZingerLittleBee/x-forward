import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CreateLogDto } from '@x-forward/bucket/dto/create-log.dto'
import { Log, LogDocument } from '@x-forward/bucket/schemas/log.schema'
import { Model } from 'mongoose'

@Injectable()
export class BucketService {
    constructor(@InjectModel('Log') private logModel: Model<LogDocument>) {}

    async create(createLogDto: CreateLogDto | CreateLogDto[]) {
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

    async findByUserIdAndTimeRange(userId: string, startTime: Date, endTime: Date): Promise<Log[]> {
        return this.logModel.find({
            user_id: userId,
            time: { $gte: startTime, $lte: endTime }
        })
    }

    async findByUserIdAndClientIdAndTimeRange(
        userId: string,
        clientId: string,
        startTime: Date,
        endTime: Date
    ): Promise<Log[]> {
        return this.logModel.find({
            user_id: userId,
            client_id: clientId,
            time: { $gte: startTime, $lte: endTime }
        })
    }

    async findByClientIdAndTimeRange(clientId: string, startTime: Date, endTime: Date): Promise<Log[]> {
        return this.logModel.find({
            client_id: clientId,
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

    async deleteByUserIdAndTimeRange(
        userId: string,
        startTime: Date,
        endTime: Date
    ): Promise<{ deletedCount: number }> {
        return this.logModel.deleteMany({
            user_id: userId,
            time: { $gte: startTime, $lte: endTime }
        })
    }
}
