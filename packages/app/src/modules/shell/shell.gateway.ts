import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { installNginx } from 'src/utils/Shell'

@WebSocketGateway(1234, {
  cors: {
    origin: ['http://localhost:5000', 'http://localhost:3000', 'http://localhost:3001', 'https://admin.socket.io'],
    credentials: true
  }
})
export class ShellGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server

  afterInit(server: any): any {
    console.log('server')
  }

  handleConnection(client: any, ...args: any[]): any {
    console.log('handleConnection')
  }

  handleDisconnect(client: any): any {
    console.log('handleDisconnect')
  }

  @SubscribeMessage('install-nginx')
  handlerInstallNginx(@MessageBody('version') version: string) {
    console.log('version', version)
    installNginx(version, (msg) => this.server.send(msg))

  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!'
  }
}
