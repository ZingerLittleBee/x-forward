export enum NginxStatusEnum {
    // 正在运行
    Running = 'active (running)',
    // 已停止
    Stop = 'inactive (dead)',
    // 发生错误
    Error = 'failed (Result: exit-code)'
}

export enum StatusEnum {
    // 正在运行
    Running,
    // 正在检查
    Checking,
    // 已停止
    Stop,
    // 未安装
    NotInstall,
    // 发生错误
    Error
}

export enum StatusTipsEnum {
    // 正在运行
    Running = '正在运行',
    // 正在检查
    Checking = '正在检查',
    // 已停止
    Stop = '已停止',
    // 未安装
    NotInstall = '未安装',
    // 发生错误
    Error = '发生错误'
}

export enum OnlineEnum {
    Online,
    Offline
}

export enum OnlineTipsEnum {
    Online = '在线',
    Offline = '离线'
}

export enum StateEnum {
    Able,
    Disable,
    Unknown
}

export enum StateTipsEnum {
    Able = '正在运行',
    Disable = '已停止',
    Unknown = '未知'
}
