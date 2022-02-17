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

@WebSocketGateway(parseInt(process.env.WSS_PORT,10), {
  cors: {
    origin: '*',
    credentials: false
  },
})
export class EventsGateway {

  constructor(private readonly rabbitMqProvider: RabbitMQProvider){}

  @WebSocketServer()
  private readonly server: Server;

  @SubscribeMessage('events')
  public async onEvent(@MessageBody() data: any,  @ConnectedSocket() client: any): Promise<WsResponse<any>> {
    const rabbitMqProvider = await this.rabbitMqProvider.getInstance();
    rabbitMqProvider.assertExchange('payment.notification.exchange', 'fanout', {
      durable: false,
    });
    const queue = await rabbitMqProvider.assertQueue('', {
      exclusive: true,
    });
    await rabbitMqProvider.bindQueue(queue.queue,'payment.notification.exchange', '')
    rabbitMqProvider.consume(queue.queue, (message) => {
      const payload = JSON.parse(message.content.toString('utf8'));
      if(data.orderId == payload.orderId) {
        client.emit('payment.notification', { ...payload });
      }
    }, { noAck: true })
    return { orderId: data.orderId , status: 'RUNNING'} as any;
  }

}