import { IResult, RegisterClientInfo, UserProperty } from '@x-forward/common'
import { NginxConfig } from '@x-forward/executor'
import { Observable } from 'rxjs'
import { LogsDto } from '../modules/logs/logs.dto'

export interface IReportService {
    register(data: RegisterClientInfo): Observable<IResult<{ id: string }>>
    getPortAndUserRelation(clientId: { id: string }): Observable<IResult<UserProperty[]>>
    getLastTime(clientId: { id: string }): Observable<IResult<string>>
    logReport(logs: { logs: LogsDto[] }): Observable<IResult<any>>
    heartBeat(clientId: { id: string }): Observable<IResult<any>>
}

export interface IExecutorService {
    getNginxBin(): Observable<IResult<string>>
    rewriteMainConfig(content: string): Observable<any>
    getNginxConfigArgs(): Observable<NginxConfig>
}
