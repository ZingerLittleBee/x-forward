// 默认值枚举, 可被 .env 覆盖
export enum DefaultEnum {
    // stream 文件存在目录名, 完整路径为: prefix/${STREAM_DIR}
    STREAM_DIR = 'stream',

    // 项目的临时目录文件夹名
    TEMP_FILE_NAME = 'temp',

    LOG_PREFIX = '/var/log/nginx',

    LOG_FILE_PREFIX = 'stream-access'
}

export enum TimeEnum {
    NumberDaysOfMonth = 30
}
