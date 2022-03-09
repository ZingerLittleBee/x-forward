const GATEWAY = '/gateway'

const REGISTER = `${GATEWAY}/register`

const RELATION = `${GATEWAY}/relation`

export const GatewayEndPoint = {
    REGISTER,
    RELATION,
    GATEWAY
}

const EXECUTOR = '/executor'

const STREAM_PATCH = `${EXECUTOR}/stream`

export const ExecutorEndPoint = {
    EXECUTOR,
    STREAM_PATCH
}

const LOGS = '/logs'
const TRAFFIC = '/traffic'

export const LogsEndPoint = {
    LOGS,
    TRAFFIC
}

const EXECUTOR_SERVICE = 'ExecutorService'
const REPORT_SERVICE = 'ReportService'
export const GrpcEndPoint = {
    EXECUTOR_SERVICE,
    REPORT_SERVICE
}
