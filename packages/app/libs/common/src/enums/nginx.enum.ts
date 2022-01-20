export enum NginxConfigArgsReflectEnum {
    'prefix' = '目录前缀',
    'sbin-path' = '执行文件路径',
    'modules-path' = '模块路径',
    'conf-path' = '配置文件路径',
    'stream-path' = 'stream 配置文件路径',
    'error-log-path' = '错误日志路径',
    'http-log-path' = 'HTTP 模块日志路径',
    'pid-path' = 'PID 路径',
    'lock-path' = 'LOCK 路径',
    'http-client-body-temp-path' = 'HTTP 请求体临时文件路径',
    'http-proxy-temp-path' = '代理临时文件路径',
    'http-fastcgi-temp-path' = 'FastCGI 临时文件路径',
    'http-uwsgi-temp-path' = 'uWSGI 临时文件路径',
    'http-scgi-temp-path' = 'SCGI 临时文件路径',
    'user' = 'nginx 用户',
    'group' = 'nginx 用户组',
    'with-compat' = '支持动态加载模块',
    'with-file-aio' = '支持在 FreeBSD 和 Linux 上使用 AIO',
    'with-threads' = '支持使用线程池',
    'with-http_addition_module' = '支持在响应前后添加文本',
    'with-http_auth_request_module' = '支持客户端鉴权',
    'with-http_dav_module' = '支持文件管理自动化',
    'with-http_flv_module' = '支持为 Flash 视频提供伪流服务器端支持',
    'with-http_gunzip_module' = '支持 gzip',
    'with-http_gzip_static_module' = '支持发送 .gz 预压缩文件',
    'with-http_mp4_module' = '支持为 MP4 视频提供伪流服务器端支持',
    'with-http_random_index_module' = '支持随机主页',
    'with-http_realip_module' = '支持 HTTP 获取客户端真实 IP',
    'with-http_secure_link_module' = '支持防盗链',
    'with-http_slice_module' = '支持拆分请求',
    'with-http_ssl_module' = '支持 HTTPS',
    'with-http_stub_status_module' = '支持状态统计',
    'with-http_sub_module' = '支持 HTTP 内容替换',
    'with-http_v2_module' = '支持 HTTP/2',
    'with-mail' = '支持邮件代理服务',
    'with-mail_ssl_module' = '支持 SSL/TLS 到邮件代理服务器',
    'with-stream' = '支持 TCP/UDP 代理',
    'with-stream_realip_module' = '支持 Stream 获取客户端真实 IP',
    'with-stream_ssl_module' = '支持 SSL/TLS 到 Stream',
    /*
    要在不解密的情况下拿到 HTTPS 流量访问的域名，只有利用 TLS / SSL 握手的第一个客户端 Hello 报文中的扩展地址 SNI（服务器名称指示）来获取.NGINX 官方从 1.11.5 版本开始支持利用ngx_stream_ssl_preread_module模块来获得这个能力，模块主要用于获取客户端 Hello 报文中的 SNI 和 ALPN 信息。对于 4 层正向代理来说，从客户端 Hello 报文中提取 SNI 的能力是至关重要的，否则 NGINX stream 的解决方案无法成立。同时这也带来了一个限制，要求所有客户端都需要在 TLS / SSL 握手中带上 SNI 字段，否则 NGINX stream 代理完全没办法知道客户端需要访问的目的域名。
     */
    'with-stream_ssl_preread_module' = '支持获取 SNI',
    'with-cc-opt' = 'C 编译器参数',
    'with-ld-opt' = '链接期间附加参数'
}

export enum NginxConfigArgsEnum {
    PREFIX = 'prefix',
    SBIN_PATH = 'sbin-path',
    MODULES_PATH = 'modules-path',
    CONF_PATH = 'conf-path',
    STREAM_PATH = 'stream-path',
    ERROR_LOG_PATH = 'error-log-path',
    HTTP_LOG_PATH = 'http-log-path',
    PID_PATH = 'pid-path',
    LOCK_PATH = 'lock-path',
    HTTP_CLIENT_BODY_TEMP_PATH = 'http-client-body-temp-path',
    HTTP_PROXY_TEMP_PATH = 'http-proxy-temp-path',
    HTTP_FASTCGI_TEMP_PATH = 'http-fastcgi-temp-path',
    HTTP_UWSGI_TEMP_PATH = 'http-uwsgi-temp-path',
    HTTP_SCGI_TEMP_PATH = 'http-scgi-temp-path',
    USER = 'user',
    GROUP = 'group',
    WITH_COMPAT = 'with-compat',
    WITH_FILE_AIO = 'with-file-aio',
    WITH_THREADS = 'with-threads',
    WITH_HTTP_ADDITION_MODULE = 'with-http_addition_module',
    WITH_HTTP_AUTH_REQUEST_MODULE = 'with-http_auth_request_module',
    WITH_HTTP_DAV_MODULE = 'with-http_dav_module',
    WITH_HTTP_FLV_MODULE = 'with-http_flv_module',
    WITH_HTTP_GUNZIP_MODULE = 'with-http_gunzip_module',
    WITH_HTTP_GZIP_STATIC_MODULE = 'with-http_gzip_static_module',
    WITH_HTTP_MP4_MODULE = 'with-http_mp4_module',
    WITH_HTTP_RANDOM_INDEX_MODULE = 'with-http_random_index_module',
    WITH_HTTP_REALIP_MODULE = 'with-http_realip_module',
    WITH_HTTP_SECURE_LINK_MODULE = 'with-http_secure_link_module',
    WITH_HTTP_SLICE_MODULE = 'with-http_slice_module',
    WITH_HTTP_SSL_MODULE = 'with-http_ssl_module',
    WITH_HTTP_STUB_STATUS_MODULE = 'with-http_stub_status_module',
    WITH_HTTP_SUB_MODULE = 'with-http_sub_module',
    WITH_HTTP_V2_MODULE = 'with-http_v2_module',
    WITH_MAIL = 'with-mail',
    WITH_MAIL_SSL_MODULE = 'with-mail_ssl_module',
    WITH_STREAM = 'with-stream',
    WITH_STREAM_REALIP_MODULE = 'with-stream_realip_module',
    WITH_STREAM_SSL_MODULE = 'with-stream_ssl_module',
    /*
    要在不解密的情况下拿到 HTTPS 流量访问的域名，只有利用 TLS / SSL 握手的第一个客户端 Hello 报文中的扩展地址 SNI（服务器名称指示）来获取.NGINX 官方从 1.11.5 版本开始支持利用ngx_stream_ssl_preread_module模块来获得这个能力，模块主要用于获取客户端 Hello 报文中的 SNI 和 ALPN 信息。对于 4 层正向代理来说，从客户端 Hello 报文中提取 SNI 的能力是至关重要的，否则 NGINX stream 的解决方案无法成立。同时这也带来了一个限制，要求所有客户端都需要在 TLS / SSL 握手中带上 SNI 字段，否则 NGINX stream 代理完全没办法知道客户端需要访问的目的域名。
     */
    WITH_STREAM_SSL_PREREAD_MODULE = 'with-stream_ssl_preread_module',
    WITH_CC_OPT = 'with-cc-opt',
    WITH_LD_OPT = 'with-ld-opt'
}

export enum ProtocolEnum {
    TCP = 'tcp',
    UDP = 'udp'
}

export enum RetriesEnum {
    ON = 'on',
    OFF = 'off'
}

export enum NginxStatusEnum {
    Active,
    Inactice,
    Failed
}
