import { Controller, Get, Query } from '@nestjs/common';
import { MongoProvider } from './mongo.provider';

@Controller()
export class AppController {
  constructor(private readonly mongoProvider: MongoProvider) {}

  @Get('/payment/status')
  public async startOrder(@Query('id') orderId: string): Promise<any> {
    const mongoInstance = await this.mongoProvider.getInstance();
    const paymentStatus = await mongoInstance
      .db('payments')
      .collection('status')
      .findOne({ orderId });
    return paymentStatus;
  }
}
