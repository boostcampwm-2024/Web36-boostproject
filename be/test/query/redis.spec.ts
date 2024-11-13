import Redis from 'ioredis';
import { RedisClient } from '../../src/config/redis/redis.client';
import { GenericContainer, Wait } from 'testcontainers';
import { SingleMySQLAdapter } from 'src/config/query-database/single-mysql.adapter';
import { mock, MockProxy } from 'jest-mock-extended';

describe('RedisClient', () => {
  let redisContainer: any;
  let redisClient: RedisClient;
  let mockQueryDbAdapter: MockProxy<SingleMySQLAdapter>;

  beforeAll(async () => {
    redisContainer = await new GenericContainer('redis')
      .withExposedPorts(6379)
      .withWaitStrategy(Wait.forListeningPorts())
      .start();
    process.env.REDIS_HOST = redisContainer.getHost();
    process.env.REDIS_PORT = redisContainer.getMappedPort(6379).toString();

    mockQueryDbAdapter = mock<SingleMySQLAdapter>();
    redisClient = new RedisClient(mockQueryDbAdapter);
  });

  afterAll(async () => {
    delete process.env.REDIS_HOST;
    delete process.env.REDIS_PORT;
    redisClient.getRedis().disconnect();
    redisClient.getPubSub().disconnect();
    await redisContainer.stop();
  });

  it('Redis container 연결 확인', async () => {
    const redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    });
    await redis.set('test', 'test');
    const value = await redis.get('test');
    expect(value).toBe('test');
    redis.disconnect();
  });

  it('RedisClient를 생성하면 redis, pubsub 클라이언트가 연결된다.', () => {
    expect(redisClient.getRedis()).toBeInstanceOf(Redis);
    expect(redisClient.getPubSub()).toBeInstanceOf(Redis);
  });

  it('getSession 메서드를 통해 Redis에 등록한 세션 정보를 조회할 수 있다.', async () => {
    const mockKey = 'session_key';
    const mockValue = 'session_value';
    await redisClient.getRedis().set(mockKey, mockValue);

    const session = await redisClient.getSession(mockKey);
    expect(session).toBe(mockValue);
  });

  it('세션 만료 시, DBAdapter의 closeConnection 메서드가 호출된다.', async () => {
    // 1초 후 만료되는 세션 등록
    redisClient.getRedis().set('test_key', 'value');
    redisClient.getRedis().expire('test_key', 1);

    // 2초 대기
    await new Promise((resolve) => setTimeout(resolve, 2000));

    expect(mockQueryDbAdapter.closeConnection).toHaveBeenCalledWith('test_key');
  });
});
