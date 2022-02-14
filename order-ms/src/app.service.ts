import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { MongoProvider } from './mongo.provider';
import { RabbitMQProvider } from './rabbitmq.provider';

@Injectable()
export class AppService {
  constructor(
    private readonly mongoProvider: MongoProvider,
    private readonly rabbitMqProvider: RabbitMQProvider,
  ) {}

  async sendOrder(orderId: string): Promise<void> {
    console.log('sendOrder - starting', orderId);
    const mongoInstance = await this.mongoProvider.getInstance();
    const status = await mongoInstance
      .db('payments')
      .collection('status')
      .insertOne({
        // @ts-ignore
        _id: orderId,
        status: 'RUNNING',
      });
    const message = Buffer.from(JSON.stringify({ orderId }));
    const rabbitMqProvider = await this.rabbitMqProvider.getInstance();
    const resultPublished = rabbitMqProvider.sendToQueue(
      'payment.start',
      message,
    );
    console.log('sendOrder.published', resultPublished);
  }
}
