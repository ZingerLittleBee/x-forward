import DefaultEnum from 'src/enums/default.enum'

// process.env util
export const getEnvSetting = (key: string): string => {
    return process.env[key] ? process.env[key] : DefaultEnum[key]
}
