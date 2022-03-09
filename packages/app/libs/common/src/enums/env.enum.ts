// Stored key in actual
export enum EnvKeyEnum {
    // nginx container name
    DockerContainerName = 'DOCKER_CONTAINER_NAME',

    // nginx bin path
    NginxBin = 'NGINX_BIN',

    // effect env
    EffectedNginx = 'EFFECTED_NGINX',

    // dns servers
    DnsServers = 'DNS_SERVERS',

    // stream log path
    StreamLogPath = 'STREAM_LOG_PATH',

    // conf dir of stream, full path: prefix/${STREAM_DIR}
    StreamDir = 'STREAM_DIR',

    TempFileName = 'TEMP_FILE_NAME',

    // log file path prefix
    LogPrefix = 'LOG_PREFIX',

    // log file prefix
    LogFilePrefix = 'LOG_FILE_PREFIX',

    // nginx log format name
    LogFormat = 'LOG_FORMAT_NAME',

    // mongo uri
    MongoUri = 'MONGO_URI',

    // online check interval
    OnlineCheckCron = 'ONLINE_CHECK_CRON',

    MaximumReportingSeconds = 'MAXIMUM_REPORTING_SECONDS',

    ServerPort = 'SERVER_PORT',

    ServerGrpcPort = 'SERVER_GRPC_PORT',

    ServerAddr = 'SERVER_ADDR',

    ClientIp = 'CLIENT_IP',

    ClientDomain = 'CLIENT_DOMAIN',

    ClientPort = 'CLIENT_PORT',

    ClientGrpcPort = 'CLIENT_GRPC_PORT',

    CommunicationKey = 'COMMUNICATION_KEY',

    LogsUploadInterval = 'LOGS_UPLOAD_INTERVAL'
}
