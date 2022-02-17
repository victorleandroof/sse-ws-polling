import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/order')
  public async startOrder(@Query('id') orderId: string): Promise<any> {
    this.appService.sendOrder(orderId);
    return { orderId: orderId , status: 'RUNNING' };
  }
}
