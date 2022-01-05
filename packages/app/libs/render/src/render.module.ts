import { CacheModule, Module } from '@nestjs/common'
import { RenderService } from './render.service'

@Module({
    imports: [CacheModule.register()],
    providers: [RenderService],
    exports: [RenderService]
})
export class RenderModule {}
