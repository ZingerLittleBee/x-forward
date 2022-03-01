import { IResult, RegisterClientInfo, UserProperty } from '@x-forward/common'
import { Observable } from 'rxjs'
import { LogsDto } from '../modules/logs/logs.dto'

export interface IReportService {
    register(data: RegisterClientInfo): Observable<IResult<{ id: string }>>
    getPortAndUserRelation(clientId: { id: string }): Observable<IResult<UserProperty[]>>
    getLastTime(clientId: { id: string }): Observable<IResult<string>>
    LogReport(logs: { logs: LogsDto[] }): Observable<IResult<any>>
}
