import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway(9527, {
  cors: {
    origin: ['http://localhost:3000']
  }
})
export class ShellGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
