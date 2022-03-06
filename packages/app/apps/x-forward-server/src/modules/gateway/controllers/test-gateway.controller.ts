import { Controller, Get } from '@nestjs/common'
import { QueryGatewayService } from '../services/query-gateway.service'

@Controller()
export class TestGatewayController {
    constructor(private readonly queryGatewayService: QueryGatewayService) {}

    @Get('bin')
    getNginxBin() {
        console.log('bin test')
        // return this.queryGatewayService.fetchNginxStreamConfigContent('304cad4d-2018-4860-bae4-20c674df3e47')
        return this.queryGatewayService.fetchDirectoryByUrl('304cad4d-2018-4860-bae4-20c674df3e47', 'root')
    }
}
