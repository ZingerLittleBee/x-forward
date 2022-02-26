import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type LogDocument = Log & Document

@Schema()
export class Log extends Document {
    @Prop()
    user_id: string

    @Prop()
    client_id: string

    @Prop()
    client_port: string

    @Prop()
    remote_addr: string

    @Prop()
    remote_port: string

    @Prop()
    protocol: string

    @Prop()
    status: string

    @Prop()
    bytes_sent: string

    @Prop()
    bytes_received: string

    @Prop()
    session_time: string

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
