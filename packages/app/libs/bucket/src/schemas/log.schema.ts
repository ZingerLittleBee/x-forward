import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type LogDocument = Log & Document

@Schema()
export class Log extends Document {
    @Prop({ alias: 'userId' })
    user_id: string

    @Prop({ alias: 'clientId' })
    client_id: string

    @Prop({ alias: 'clientPort' })
    client_port: string

    @Prop({ alias: 'remoteAddr' })
    remote_addr: string

    @Prop({ alias: 'remotePort' })
    remote_port: string

    @Prop()
    protocol: string

    @Prop()
    status: string

    @Prop({ alias: 'bytesSent' })
    bytes_sent: string

    @Prop({ alias: 'bytesReceived' })
    bytes_received: string

    @Prop({ alias: 'sessionTime' })
    session_time: string

    @Prop({ alias: 'upstreamAddr' })
    upstream_addr: string

    @Prop({ alias: 'upstreamBytesSent' })
    upstream_bytes_sent: string

    @Prop({ alias: 'upstreamBytesReceived' })
    upstream_bytes_received: string

    @Prop({ alias: 'upstreamConnectTime' })
    upstream_connect_time: string

    @Prop({ alias: 'upstreamSessionTime' })
    upstream_session_time: string

    @Prop()
    time: Date
}

export const LogSchema = SchemaFactory.createForClass(Log)
