enum StatusEnum {
    // 正在检查
    Checking,
    // 正在运行
    Running,
    // 已停止
    Stop,
    // 未安装
    NotInstall,
    // 发生错误
    Error
}

enum StateEnum {
    // 可用
    Able,
    // 禁用
    Disable
}

export { StatusEnum, StateEnum }
