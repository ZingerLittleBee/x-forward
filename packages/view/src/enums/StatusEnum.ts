export enum StatusEnum {
    // 正在运行
    Running = 'active (running)',
    // 正在检查
    Checking = 'active (running)',
    // 已停止
    Stop = 'inactive (dead)',
    // 未安装
    NotInstall = 'active (running)',
    // 发生错误
    Error = 'failed (Result: exit-code)'
}
