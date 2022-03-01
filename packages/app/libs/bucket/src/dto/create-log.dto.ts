// export class CreateLogDto extends PartialType(Log) {}

export class CreateLogDto {
    clientId: string

    clientPort: string

    userId: string

    remoteAddr: string

    remotePort: string

    protocol: string

    status: string

    bytesSent: string

    bytesReceived: string

    sessionTime: string

    upstreamAddr: string

    upstreamBytesSent: string

    upstreamBytesReceived: string

    upstreamConnectTime: string

    upstreamSessionTime: string

    time: string
}
