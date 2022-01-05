import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets'
import { WSEnum } from '@x-forward/common'
import { IPty, spawn } from 'node-pty'
import { Server } from 'socket.io'
import { installNginx } from '../../utils/Shell'

@WebSocketGateway(1234, {
    cors: {
        origin: [
            'http://localhost:5000',
            'http://localhost:8000',
            'http://localhost:3000',
            'http://localhost:3001',
            'https://admin.socket.io'
        ],
        credentials: true
    }
})
export class ShellGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    /**
     * ws 初始化连接钩子事件
     * @param server server
     */
    afterInit(server: any): any {
        console.log('server')
    }

    /**
     * ws 连接成功钩子事件
     * @param client client
     * @param args args
     */
    handleConnection(client: any, ...args: any[]): any {
        console.log('handleConnection')
    }

    /**
     * ws 断开连接钩子事件
     * @param client client
     */
    handleDisconnect(client: any): any {
        console.log('handleDisconnect')
    }

    /**
     * 处理 nginx 安装请求
     * @param version 安装的版本
     */
    @SubscribeMessage(WSEnum.INSTALL_NGINX)
    handlerInstallNginx(@MessageBody() version: string) {
        console.log('version', version)
        installNginx(version, msg => this.server.send(msg))
    }

    ptyProcess: IPty

    /**
     * 初始化 pty
     * @param channel 通讯频道
     */
    private initPTY(channel: string, cols?: number) {
        this.ptyProcess = spawn(this.getDefaultShell(), [], {
            name: 'xterm-color',
            cwd: process.env.HOME,
            cols,
            env: {
                ...process.env,
                TERM: 'xterm-256color',
                COLORTERM: 'truecolor'
            }
        })
        this.ptyProcess.onData(chunk => {
            this.server.emit(channel, chunk)
        })
    }

    /**
     * 获取不同平台的终端
     * @returns shell
     */
    private getDefaultShell = () => {
        if (process.platform === 'darwin') {
            return process.env.SHELL || WSEnum.ZSH
        }
        if (process.platform === 'win32') {
            return WSEnum.POWER_SHELL
        }
        return process.env.SHELL || WSEnum.SH
    }

    /**
     * 初始化 pty
     */
    @SubscribeMessage(WSEnum.TERMINAL_START)
    handlerTerminal() {
        this.initPTY(WSEnum.TERMINAL_DATA)
    }

    /**
     * 接收前端输入的数据
     * @param data data
     */
    @SubscribeMessage(WSEnum.TERMINAL_DATA)
    handlerTerminalData(@MessageBody() data: string) {
        this.ptyProcess.write(data)
    }

    /**
     * 监听终端关闭事件
     */
    @SubscribeMessage(WSEnum.TERMINAL_CLOSE)
    handlerTerminalClose() {
        this.ptyProcess.kill()
    }

    /**
     * 处理 terminal 尺寸 resize 事件
     * @param dimensions 尺寸
     */
    @SubscribeMessage(WSEnum.TERMINAL_RESIZE)
    handlerTerminalResize(@MessageBody() dimensions: { cols: number; rows: number }) {
        this.ptyProcess.resize(dimensions.cols, dimensions.rows)
    }
}
