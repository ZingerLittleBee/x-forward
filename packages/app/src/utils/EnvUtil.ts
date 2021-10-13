
// process.env util
export const getEnvByKey = (key: string): string => {
    return process.env[key]
}