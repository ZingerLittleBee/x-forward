export interface RegisterClientInfo {
    id?: string
    ip?: string
    domain?: string
    port?: string | number
}

export interface UserProperty {
    userId: string
    ports: (string | number)[]
}
