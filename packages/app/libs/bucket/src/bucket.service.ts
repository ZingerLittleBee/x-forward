import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Log, LogDocument } from '@x-forward/bucket/schemas/log.schema'
import { CreateLogDto } from '@x-forward/bucket/dto/create-log.dto'

@Injectable()
export class BucketService {
    constructor(@InjectModel('Log') private logModel: Model<LogDocument>) {}

    async create(createLogDto: CreateLogDto): Promise<Log> {
        const createdCat = new this.logModel(createLogDto)
        return createdCat.save()
    }

    async findAll(): Promise<Log[]> {
        return this.logModel.find().exec()
    }
}
