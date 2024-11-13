import Redis from 'ioredis';
import { RedisService } from '../../src/config/redis/redis.service';
import { GenericContainer, Wait } from 'testcontainers';
import { SingleMySQLAdapter } from 'src/config/query-database/single-mysql.adapter';
import { mock, MockProxy } from 'jest-mock-extended';

describe('RedisService', () => {
  let redisContainer: any;
  let redisService: RedisService;
  let mockQueryDbAdapter: MockProxy<SingleMySQLAdapter>;

  beforeAll(async () => {
    redisContainer = await new GenericContainer('redis')
      .withExposedPorts(6379)
      .withWaitStrategy(Wait.forListeningPorts())
      .start();
    process.env.REDIS_HOST = redisContainer.getHost();
    process.env.REDIS_PORT = redisContainer.getMappedPort(6379).toString();

    mockQueryDbAdapter = mock<SingleMySQLAdapter>();
    redisService = new RedisService(mockQueryDbAdapter);
  });

  afterAll(async () => {
    delete process.env.REDIS_HOST;
    delete process.env.REDIS_PORT;
    redisService.getDefaultConnection().disconnect();
    redisService.getEventConnection().disconnect();
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

  it('RedisService를 생성하면 redis, pubsub 클라이언트가 연결된다.', () => {
    expect(redisService.getDefaultConnection()).toBeInstanceOf(Redis);
    expect(redisService.getEventConnection()).toBeInstanceOf(Redis);
  });

  it('세션 저장소에 존재하지 않는 세션 ID의 경우, setNewSession 메서드를 통해 세션 정보를 등록할 수 있다.', async () => {
    const sessionId = 'session_key';

    await redisService.setNewSession(sessionId);

    expect(mockQueryDbAdapter.createConnection).toHaveBeenCalledWith(sessionId);
  });

  it('getSession 메서드를 통해 Redis에 등록한 세션 정보를 조회할 수 있다.', async () => {
    const mockKey = 'session_key';
    const mockValue = 'session_value';
    await redisService.getDefaultConnection().set(mockKey, mockValue);

    const session = await redisService.getSession(mockKey);
    expect(session).toBe(mockValue);
  });

  it('세션 만료 시, DBAdapter의 closeConnection 메서드가 호출된다.', async () => {
    // 1초 후 만료되는 세션 등록
    redisService.getDefaultConnection().set('test_key', 'value');
    redisService.getDefaultConnection().expire('test_key', 1);

    // 2초 대기
    await new Promise((resolve) => setTimeout(resolve, 2000));

    expect(mockQueryDbAdapter.closeConnection).toHaveBeenCalledWith('test_key');
  });
});
