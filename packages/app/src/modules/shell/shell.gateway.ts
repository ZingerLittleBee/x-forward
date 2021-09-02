import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

@WebSocketGateway(1234, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001']
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

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!'
  }
}
