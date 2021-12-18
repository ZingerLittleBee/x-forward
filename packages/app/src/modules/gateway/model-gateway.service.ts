import { Injectable } from '@nestjs/common'
import { omit } from 'lodash'
import { StreamService } from '../stream/stream.service'
import { UpstreamService } from '../upstream/upstream.service'
import { ModelGatewayApi } from './interface/gateway.interface'

@Injectable()
export class ModelGatewayService implements ModelGatewayApi {
    constructor(private readonly upstreamService: UpstreamService, private readonly streamService: StreamService) {}

    async getFullStream() {
        let upstreams = await this.upstreamService.findEffect()
        let streams = await this.streamService.findNullFK()
        streams = streams.concat(
            upstreams
                .map(u => {
                    u.stream?.forEach(s => (s.upstreamId = u.id))
                    return u.stream
                })
                .flat()
        )
        upstreams = upstreams.map(u => omit(u, 'stream'))
        return {
            streamEntities: streams,
            upstreamEntities: upstreams
        }
    }
}
