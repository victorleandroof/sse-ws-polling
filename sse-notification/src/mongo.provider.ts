import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@Injectable()
export class MongoProvider {
  public static instance: MongoClient;

  public async getInstance(): Promise<MongoClient> {
    if (!MongoProvider.instance) {
      const client = new MongoClient(process.env.MONGODB_URL);
      await client.connect();
      MongoProvider.instance = client;
    }
    return MongoProvider.instance;
  }
}
