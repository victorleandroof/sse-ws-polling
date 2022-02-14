import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongoProvider } from './mongo.provider';
@Module({
  imports: [],
  controllers: [AppController],
  providers: [MongoProvider],
})
export class AppModule {}
