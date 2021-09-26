import { Controller, Get } from '@nestjs/common'
import { Stream } from './stream.entity'
import { StreamService } from './stream.service'

@Controller('stream')
export class StreamController {
    constructor(private streamService: StreamService) {}

    @Get('')
    getAllStream(): Promise<Stream[]> {
        return this.streamService.streamList()
    }
}
