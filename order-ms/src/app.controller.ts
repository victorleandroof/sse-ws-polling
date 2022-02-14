import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/order')
  public async startOrder(@Query('id') orderId: string): Promise<void> {
    this.appService.sendOrder(orderId);
  }
}