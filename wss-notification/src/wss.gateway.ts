import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RabbitMQProvider } from './rabbitmq.provider';

@WebSocketGateway(8080, {
  cors: {
    origin: '*',
    credentials: false
  }
})
export class EventsGateway {

  constructor(private readonly rabbitMqProvider: RabbitMQProvider){}

  @WebSocketServer()
  private readonly server: Server;

  @SubscribeMessage('events')
  public async onEvent(@MessageBody() data: any,  @ConnectedSocket() client: any): Promise<WsResponse<any>> {
    const rabbitMqProvider = await this.rabbitMqProvider.getInstance();
    rabbitMqProvider.consume('payment.notification', (message) => {
      const payload = JSON.parse(message.content.toString('utf8'));
      if(data.orderId === payload.orderId) {
        client.emit('payment.notification', { ...payload });
      }
      rabbitMqProvider.ack(message);
    })
    return { orderId: data.orderId , status: 'RUNNING'} as any;
  }

}