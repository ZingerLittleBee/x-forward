import { Module } from '@nestjs/common'
import { BucketService } from './bucket.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Log, LogSchema } from '@x-forward/bucket/schemas/log.schema'

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: Log.name,
                useFactory: () => LogSchema
            }
        ])
    ],
    providers: [BucketService],
    exports: [BucketService]
})
export class BucketModule {}
