import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AppController } from './app.controller';
import { MongoProvider } from './mongo.provider';

@Module({
  imports: [PrometheusModule.register()],
  controllers: [AppController],
  providers: [MongoProvider],
})
export class AppModule {}
