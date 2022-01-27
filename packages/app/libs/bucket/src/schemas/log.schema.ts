import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type LogDocument = Log & Document

@Schema()
export class Log extends Document {
    @Prop()
    server_id: string

    @Prop()
    user_id: string

    @Prop()
    server_addr: string

    @Prop()
    server_port: string

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
