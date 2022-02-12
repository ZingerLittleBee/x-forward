// Stored key in actual
export enum EnvKeyEnum {
    // nginx conf
    NginxConfigArgs = 'NGINX_CONFIG_ARGS',

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

    MaximumReportingSeconds = 'MAXIMUM_REPORTING_SECONDS'
}
