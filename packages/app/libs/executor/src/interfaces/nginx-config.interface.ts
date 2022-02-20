/**
 * 缓存处理过的 nginx -V 配置信息结构体
 */
export interface NginxConfig {
    version?: string
    args?: { [key: string]: { label: string; value: string } }
    module?: string[]
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface INginxConfig {
    /**
     * 获取 nginx 配置参数
     * 1. 先从 cache 中查找
     * 2. 不存在, 则装配配置参数
     */
    getNginxConfigArgs(): Promise<NginxConfig>
    /**
     * get nginx configuration prefix
     */
    getPrefix(): Promise<string>

    /**
     * 获取 nginx 执行目录
     * 1. 首先查找 cache 中是否存在 sbin-path
     * 2. 其次查找本地 .env
     * 3. 最后使用 which nginx
     * 4. 如果都没找到, 抛出异常
     */
    getNginxBin(): Promise<string>

    /**
     * get ${nginx -V} result
     */
    getNginxVersion(): Promise<string>

    /**
     * get nginx.conf full path
     */
    getMainConfigPath(): Promise<string>

    /**
     * get nginx.conf file content
     */
    getMainConfigContent(): Promise<string>

    /**
     * 获取 stream 配置文件路径
     * 1. 如果目录下存在 uuid.conf 文件; 则返回, 如果存在多个, 则返回第一个
     * 2. 如果不存在, 则创建 uuid.conf 文件
     */
    getStreamConfigPath(): Promise<string>

    /**
     * get stream.conf directory
     */
    getStreamDirectory(): Promise<string>

    /**
     * get HTTP conf file full path
     */
    getHTTPConfigPath(): Promise<string>

    /**
     * get stream.conf file content
     */
    getStreamFileContent(): Promise<string>

    /**
     * rewrite nginx main config
     */
    mainConfigRewrite(content: string): Promise<void>

    /**
     * nginx's configuration append ${appendString} in the end of file
     */
    mainConfigAppend(appendString: string): Promise<void>

    /**
     * 1. 先备份一份原配置文件, 名为 stream.conf.bak
     * 2. 新配置文件覆写
     * 3. nginx -t -c stream.conf 检查语法是否通过
     * 4. 不通过则回滚 stream.conf.bak
     * @param content 新 stream 文件内容
     */
    streamPatch(content: string): void
}
