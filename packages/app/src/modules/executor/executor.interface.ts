export interface ExecutorInterface {
    /**
     * 获取 stream 配置文件路径
     */
    getStreamConfigPath: () => Promise<string>

    /**
     * 获取 HTTP 配置文件路径
     */
    getHTTPConfigPath: () => Promise<string>
    /**
     * 获取 stream.conf 的内容
     */
    getStreamFileContent: () => Promise<string>
    /**
     * nginx 主配置 patch
     */
    mainConfigPatch: () => void
    /**
     * stream 配置替换
     */
    streamPatch: () => void
}
