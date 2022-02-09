// 默认值枚举, 可被 .env 覆盖
export enum DefaultEnum {
    // stream 文件存在目录名, 完整路径为: prefix/${STREAM_DIR}
    STREAM_DIR = 'stream',

    // 项目的临时目录文件夹名
    TEMP_FILE_NAME = 'temp',

    LOG_PREFIX = '/var/log/nginx',

    LOG_FILE_PREFIX = 'stream-access',

    // log format name
    LOG_FORMAT_NAME = 'stream_json',

    ONLINE_CHECK_CRON = '*/5 * * * *'
}

export enum DefaultTimeEnum {
    NumberDaysOfMonth = 30
}
