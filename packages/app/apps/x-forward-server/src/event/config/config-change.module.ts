import { Module } from '@nestjs/common'
import { RenderModule } from '@x-forward/render'
import { ClientModule } from '../../modules/client/client.module'
import { GatewayModule } from '../../modules/gateway/gateway.module'
import { UpstreamModule } from '../../modules/upstream/upstream.module'
import { ConfigChangeListener } from './config-change.listener'

@Module({
    imports: [UpstreamModule, GatewayModule, RenderModule, ClientModule],
    providers: [ConfigChangeListener]
})
export class ConfigChangeModule {}
