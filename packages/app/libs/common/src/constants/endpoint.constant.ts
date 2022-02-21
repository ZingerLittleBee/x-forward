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
