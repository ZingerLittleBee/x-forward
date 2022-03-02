import { Injectable } from '@nestjs/common'
import { BucketService } from '@x-forward/bucket'
import { CreateLogDto } from '@x-forward/bucket/dto/create-log.dto'
import { Log } from '@x-forward/bucket/schemas/log.schema'
import { DefaultTimeEnum } from '@x-forward/common'
import * as moment from 'moment'

@Injectable()
export class LogsService {
    constructor(private readonly bucketService: BucketService) {}

    async add(logs: CreateLogDto | CreateLogDto[]): Promise<Log | Log[]> {
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

    async getLastTimeByClientId(clientId: string) {
        return (await this.bucketService.getLastTimeByClientId(clientId))?.time
    }

    /**
     * traffic = byte_sent + byte_received
     * @param userId userId
     * @param startTime startTime
     * @param endTime endTime
     * @returns traffic unit bytes
     */
    async getTraffic(userId: string, startTime: Date, endTime: Date): Promise<number> {
        const userData = await this.bucketService.findByUserIdAndTimeRange(userId, startTime, endTime)
        return this.computedTraffic(userData)
    }

    /**
     * get user traffic in clientId
     * @param userId userId
     * @param clientId clientId
     * @param startTime startTime
     * @param endTime endTime
     * @returns traffic unit bytes
     */
    async getTrafficByClientId(userId: string, clientId: string, startTime: Date, endTime: Date) {
        const userData = await this.bucketService.findByUserIdAndClientIdAndTimeRange(
            userId,
            clientId,
            startTime,
            endTime
        )
        return this.computedTraffic(userData)
    }

    private computedTraffic(data: Log[]) {
        let traffic: number
        data?.forEach(d => {
            traffic += Number(d?.bytes_received) + Number(d?.bytes_sent)
        })
        return traffic
    }
}
