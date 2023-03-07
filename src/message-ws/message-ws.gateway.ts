import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessageDto } from './dto/message.dto';
import { MessageWsService } from './message-ws.service';

@WebSocketGateway({ cors: true })
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(private readonly messageWsService: MessageWsService) {}
  handleConnection(client: Socket, ...args: any[]) {
    this.messageWsService.registerClient(client);
    this.wss.emit('users', this.messageWsService.getClients());
  }
  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);
    this.wss.emit('users', this.messageWsService.getClients());
  }

  @SubscribeMessage('im')
  onIm(client: Socket, payload: MessageDto) {
    // this.wss.emit('im', payload);
    client.broadcast.emit('im', { ...payload, from: client.id });
  }
}
