enum EnvEnum {
    NGINX_CONFIG_ARGS = 'nginx_config_args',
    // nginx 容器
    DOCKER_CONTAINER_NAME = 'DOCKER_CONTAINER_NAME',
    // 本地 nginx
    NGINX_BIN = 'NGINX_BIN',
    // 生效的配置
    EFFECTED_NGINX = 'EFFECTED_NGINX',
    // stream 文件存在目录名, 完整路径为: prefix/${STREAM_DIR}
    STREAM_DIR = 'STREAM_DIR',

    // stream 配置文件名, prefix/${STREAM_DIR}/${STREAM_FILE_NAME}
    STREAM_FILE_NAME = 'STREAM_FILE_NAME',

    // 项目的临时目录文件夹名
    TEMP_FILE_NAME = 'TEMP_FILE_NAME',

    // nginx 主 config 文件名, 完整路径为: prefix/${NGINX_MAIN_CONFIG_NAME}
    NGINX_MAIN_CONFIG_NAME = 'NGINX_MAIN_CONFIG_NAME',
    DNS_SERVERS = 'DNS_SERVERS'
}

export { EnvEnum }
