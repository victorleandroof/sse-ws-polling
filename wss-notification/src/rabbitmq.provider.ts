import * as amqplib from 'amqplib';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RabbitMQProvider {
  private static instance: amqplib.Channel;

  public async getInstance() {
    if (!RabbitMQProvider.instance) {
      const connection = await amqplib.connect(process.env.RABBITMQ_URL);
      const channel = await connection.createChannel();
      RabbitMQProvider.instance = channel;
    }
    return RabbitMQProvider.instance;
  }
}
