export interface NginxStatus {
    mainPid?: string
    workerPid?: string[]
    active?: string
    uptime?: string
    since?: string
    memory?: string
    tasks?: string
    tasksLimit?: string
}

export interface INginxStatus {
    /**
     * query nginx status from `service nginx status`
     */
    queryNginxStatus(): Promise<NginxStatus>
}
