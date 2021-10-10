enum NginxConfigArgsEnum {
    'prefix' = '目录前缀',
    'sbin-path' = '执行文件路径',
    'modules-path' = '模块路径',
    'conf-path' = '配置文件路径',
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
    'with-cc-opt' = '设置 C 编译器参数',
    'with-ld-opt' = '设置链接期间附加参数'
}

enum NginxLoadBalancing {
    // Nginx根据请求次数，将每个请求均匀分配到每台服务器
    poll,
    weight,
    // 客户机的IP地址用作散列键，用于确定应该为客户机的请求选择服务器组中的哪个服务器
    ip_hash,
    // 这是更加智能的调度算法，但Nginx本身不支持fair调度算法。如果需要使用fair调度，必须下载Nginx相关模块upstream_fair。
    fair,
    // Nginx本身是不支持url_hash，如果需要使用这种调度算法，必须安装Nginx的hash模块软件包。
    url_hash
}

export { NginxLoadBalancing, NginxConfigArgsEnum }
