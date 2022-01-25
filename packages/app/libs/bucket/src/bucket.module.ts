import { Module } from '@nestjs/common'
import { BucketService } from './bucket.service'
import { MongooseModule } from '@nestjs/mongoose'
import { getEnvSetting } from '@x-forward/common'

@Module({
    imports: [MongooseModule.forRoot(getEnvSetting('MongoUri'))],
    providers: [BucketService],
    exports: [BucketService]
})
export class BucketModule {}
