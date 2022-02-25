import { Injectable } from '@nestjs/common'
import { BucketService } from '@x-forward/bucket'
import { CreateLogDto } from '@x-forward/bucket/dto/create-log.dto'
import { DefaultTimeEnum } from '@x-forward/common'
import * as moment from 'moment'

@Injectable()
export class LogsService {
    constructor(private readonly bucketService: BucketService) {}

    async add(logs: CreateLogDto) {
        return this.bucketService.create(logs)
    }

    async getCurrentMonth() {
        return this.bucketService.findByTimeRange(moment().startOf('month').toDate(), moment().toDate())
    }

    async getLastSomeMonth(some: number) {
        return this.bucketService.findByTimeRange(
            moment().startOf('month').subtract(some, 'months').toDate(),
            moment().endOf('month').subtract(some, 'months').endOf('month').toDate()
        )
    }

    async getLastMonth() {
        return this.getLastSomeMonth(1)
    }

    async getNextSomeDays(startTime: Date, someDays: number) {
        return this.bucketService.findByTimeRange(startTime, moment(startTime).add(someDays, 'days').toDate())
    }

    async getBeforeSomeDays(endTime: Date, someDays: number) {
        return this.bucketService.findByTimeRange(
            moment(endTime)
                .subtract(someDays - 1, 'days')
                .toDate(),
            endTime
        )
    }

    async getBeforeMonths(endTime: Date) {
        return this.getBeforeSomeDays(endTime, DefaultTimeEnum.NumberDaysOfMonth)
    }

    async getLastSomeDay(some: number) {
        return this.bucketService.findByTimeRange(
            moment()
                .startOf('day')
                .subtract(some - 1, 'days')
                .toDate(),
            moment().toDate()
        )
    }

    async getCurrentDay() {
        return this.bucketService.findByTimeRange(moment().startOf('day').toDate(), moment().toDate())
    }

    async getLast30Day() {
        return this.getLastSomeDay(30)
    }

    async getLast7Day() {
        return this.getLastSomeDay(7)
    }

    async getLastSomeWeek(some: number) {
        return this.bucketService.findByTimeRange(
            moment().startOf('week').subtract(some, 'weeks').toDate(),
            moment().endOf('week').subtract(some, 'weeks').toDate()
        )
    }

    async getCurrentWeek() {
        return this.bucketService.findByTimeRange(moment().startOf('week').toDate(), moment().toDate())
    }

    async getLastWeek() {
        return this.getLastSomeWeek(1)
    }

    async getLastTimeByServerId(serverId: string) {
        return (await this.bucketService.getLastTimeByServerId(serverId))?.time
    }
}
