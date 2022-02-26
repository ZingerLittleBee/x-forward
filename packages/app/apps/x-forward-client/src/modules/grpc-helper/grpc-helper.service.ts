import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { IReportService } from '../../interfaces/report.interface'

@Injectable()
export class GrpcHelperService implements OnModuleInit {
    constructor(@Inject('REPORT_PACKAGE') private clientGrpc: ClientGrpc) {}

    reportService: IReportService

    onModuleInit() {
        this.reportService = this.clientGrpc.getService<IReportService>('ReportService')
    }
}
