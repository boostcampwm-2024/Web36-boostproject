import { Injectable } from '@nestjs/common';
import { RedisClient } from 'src/infrastructure/redis/redis.client';

@Injectable()
export class SessionService {
  constructor(private readonly redisClient: RedisClient) {}

  async isValidSession(sessionId: string) {
    if (!sessionId) {
      return false;
    }
    const session = await this.redisClient.getSession(sessionId);
    if (session) {
      return true;
    }
    return false;
  }
}
