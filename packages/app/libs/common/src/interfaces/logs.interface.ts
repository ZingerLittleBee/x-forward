export interface Logs {
    serverPort: string

    remoteAddr: string

    remotePort: string

    protocol: string

    status: string

    bytesSent: string

    bytesReceived: string

    upstreamAddr: string

    upstreamBytesSent: string

    upstreamBytesReceived: string

    upstreamConnectTime: string

    upstreamSessionTime: string

    time: Date
}
