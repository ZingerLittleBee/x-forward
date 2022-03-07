import { ProcessOutput, ProcessPromise } from 'zx'

export interface SystemInfo {
    hostname?: string
    kernelRelease?: string
    kernelVersion?: string
    hardware?: string
    distributorId?: string
    description?: string
    release?: string
    codename?: string
}

export interface ISystem {
    /**
     * get all directory under path
     */
    fetchDirectory(url: string): Promise<string>

    /**
     * nginx reloads to make configuration effect
     */
    nginxReload(): void

    /**
     * nginx restart
     */
    nginxRestart(): void

    /**
     * get system info
     */
    getSystemInfo(): Promise<SystemInfo>

    /**
     * get IP
     */
    getIp(): Promise<string>

    /**
     * check path is existed or not
     * @param path filePath or dirPath
     */
    checkPath(path: string): Promise<boolean>

    /**
     * mkdir or touch file
     * @param path filePath or dirPath
     */
    mkPath(path: string): Promise<void>

    tailFile(path: string): ProcessPromise<ProcessOutput>
}
