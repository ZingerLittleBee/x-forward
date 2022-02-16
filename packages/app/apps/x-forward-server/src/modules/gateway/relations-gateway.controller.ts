import { Controller, Get, Param } from '@nestjs/common'
import { RelationsGatewayService } from './services/relations-gateway.service'

@Controller('gateway/relations')
export class RelationsGatewayController {
    constructor(private readonly relationsGatewayService: RelationsGatewayService) {}

    @Get('port')
    getPortAndUserRelation(@Param() clientId: string) {
        return this.relationsGatewayService.getPortAndUserRelation(clientId)
    }
}
