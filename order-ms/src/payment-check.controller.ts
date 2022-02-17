import { Controller, OnModuleInit } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';
import { clearInterval } from 'timers';
import { MongoProvider } from './mongo.provider';
import { RabbitMQProvider } from './rabbitmq.provider';

@Controller()
export class PaymentCheckController implements OnModuleInit {
  constructor(
    private readonly mongoProvider: MongoProvider,
    private readonly rabbitMqProvider: RabbitMQProvider,
  ) {}

  public async onModuleInit() {
    const rabbitMqProvider = await this.rabbitMqProvider.getInstance();
    rabbitMqProvider.consume('payment.start', async (message) => {
      console.log('checkPayment.received');
      let interval = setTimeout(() => {
        this.checkPayment(message);
        clearInterval(interval);
      }, this.getRandomInt(10000,40000));
      rabbitMqProvider.ack(message);
    });
  }

  public async checkPayment(consumeMessage: ConsumeMessage): Promise<void> {
    const payload = JSON.parse(consumeMessage.content.toString('utf8'));
    const filter = { _id: payload.orderId };
    const data = { $set: { status: 'SUCESS' } };
    const mongoInstance = await this.mongoProvider.getInstance();
    const updaterResult = await mongoInstance
      .db('payments')
      .collection('status')
      .updateOne(filter, data);
    console.log('checkPayment.updateOne', updaterResult.modifiedCount);
    const message = Buffer.from(
      JSON.stringify({
        orderId: payload.orderId,
        status: 'SUCESS',
      }),
    );
    const rabbitMqProvider = await this.rabbitMqProvider.getInstance();
    await rabbitMqProvider.assertExchange('payment.notification.exchange', 'fanout', {
      durable: false,
    });
    const resultSend = rabbitMqProvider.publish(
      'payment.notification.exchange',
      '',
      message,
    );
    console.log('checkPayment.sendNotification', resultSend);
  }

  private getRandomInt(min:number, max:number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
