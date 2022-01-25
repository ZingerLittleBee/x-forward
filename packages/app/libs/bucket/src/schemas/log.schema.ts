import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type LogDocument = Log & Document

@Schema()
export class Log extends Document {
    @Prop()
    serverId: string

    @Prop()
    useId: string

    @Prop()
    serverAddr: string

    @Prop()
    serverPort: string

    @Prop()
    remoteAddr: string

    @Prop()
    remotePort: string

    @Prop()
    protocol: string

    @Prop()
    status: string

    @Prop()
    bytes_sent: string

    @Prop()
    bytes_received: string

    @Prop()
    upstream_addr: string

    @Prop()
    upstream_bytes_sent: string

    @Prop()
    upstream_bytes_received: string

    @Prop()
    upstream_connect_time: string

    @Prop()
    upstream_session_time: string

    @Prop()
    time: Date
}

export const LogSchema = SchemaFactory.createForClass(Log)
