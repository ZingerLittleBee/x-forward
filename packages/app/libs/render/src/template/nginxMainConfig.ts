export default `user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log notice;
pid /var/run/nginx.pid;
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    log_format main '$remote_addr - $remote_user [$time_local] "$request" ' '$status $body_bytes_sent "$http_referer" ' '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;
    sendfile on;
    #tcp_nopush on;
    keepalive_timeout 65;
    #gzip on;
    include /etc/nginx/conf.d/*.conf;
}

stream {
    log_format {{logFormat}} '$server_port '$remote_addr ' '$remote_port ' '$protocol ' '$status ' '$bytes_sent ' '$bytes_received ' '$session_time ' '$upstream_addr ' '$upstream_bytes_sent ' '$upstream_bytes_received ' '$upstream_connect_time ' '$upstream_session_time ' '$time_iso8601';
    access_log {{logPrefix}}/stream/{{logFilePrefix}}.log {{logFormat}};
    include {{streamDir}}/*.conf;
}`

export const streamBlock = `
stream {
    log_format {{logFormat}} '$server_port ' '$remote_addr ' '$remote_port ' '$protocol ' '$status ' '$bytes_sent ' '$bytes_received ' '$session_time ' '$upstream_addr ' '$upstream_bytes_sent ' '$upstream_bytes_received ' '$upstream_connect_time ' '$upstream_session_time ' '$time_iso8601';
    access_log {{logPrefix}}/stream/{{logFilePrefix}}.log {{logFormat}};
    include {{streamDir}}/*.conf;
}`

// export const streamBlock = `
// stream {
//     log_format {{logFormat}} escape=json
//     '{'
//       '"time_local":"$time_local",'
//       '"server_port":"$server_port",'
//       '"remote_addr":"$remote_addr",'
//       '"remote_port":"$remote_port",'
//       '"protocol": "$protocol",'
//       '"status": "$status",'
//       '"bytes_sent": "$bytes_sent",'
//       '"bytes_received": "$bytes_received",'
//       '"session_time": "$session_time",'
//       '"upstream_addr": "$upstream_addr",'
//       '"upstream_bytes_sent": "$upstream_bytes_sent",'
//       '"upstream_bytes_received": "$upstream_bytes_received",'
//       '"upstream_connect_time": "$upstream_connect_time",'
//       '"upstream_session_time": "$upstream_session_time"'
//     '}';

//     access_log {{logPrefix}}/stream/{{logFilePrefix}}.log {{logFormat}};
//     include {{streamDir}}/*.conf;
// }`

export const streamInclude = `
    include {{streamDir}}/*.conf;`
