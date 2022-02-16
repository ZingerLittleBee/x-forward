import { Module } from '@nestjs/common'
import { RegistryService } from './registry.service'

@Module({
    imports: [],
    providers: [RegistryService]
})
export class RegistryModule {}
