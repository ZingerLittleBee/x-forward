import { IResult, RegisterClientInfo, UserProperty } from '@x-forward/common'
import { Observable } from 'rxjs'

export interface IReportService {
    register(data: RegisterClientInfo): Observable<IResult<{ id: string }>>
    getPortAndUserRelation(clientId: { id: string }): Observable<IResult<UserProperty[]>>
    getLastTime(clientId: { id: string }): Observable<IResult<string>>
}
