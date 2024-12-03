import { UserDBConnectionInterceptor } from '../../src/interceptors/user-db-connection.interceptor';
import {
  BadGatewayException,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { MySqlContainer } from '@testcontainers/mysql';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, of, throwError } from 'rxjs';
import { mock } from 'jest-mock-extended';
import {
  ConnectionLimitExceedException,
  DataLimitExceedException,
} from '../../src/common/exception/custom-exception';
import { StartedTestContainer } from 'testcontainers';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Test, TestingModule } from '@nestjs/testing';

let interceptor: UserDBConnectionInterceptor;
let dbContainer: StartedTestContainer;
const mockContext = mock<ExecutionContext>();
const mockConfigService = mock<ConfigService>();
const mockCallHandler = mock<CallHandler>();

const TEST_SESSION_ID = 'db12345678';
const TEST_REQUEST = {
  sessionID: TEST_SESSION_ID,
  dbConnection: null,
};

beforeAll(async () => {
  dbContainer = await new MySqlContainer()
    .withUsername(TEST_SESSION_ID.substring(0, 10))
    .withUserPassword(TEST_SESSION_ID)
    .withDatabase(TEST_SESSION_ID)
    .withExposedPorts(3306)
    .withCommand(['--max_connections=1'])
    .start();
});

afterAll(async () => {
  await dbContainer.stop();
});

beforeEach(async () => {
  // Mock ConfigService
  mockConfigService.get.mockImplementation((key: string) => {
    const config = {
      QUERY_DB_HOST: dbContainer.getHost(),
      QUERY_DB_PORT: dbContainer.getMappedPort(3306),
    };
    return config[key];
  });

  //Mock Context
  setupMockContext();
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      UserDBConnectionInterceptor,
      { provide: ConfigService, useValue: mockConfigService },
    ],
  }).compile();

  interceptor = module.get<UserDBConnectionInterceptor>(
    UserDBConnectionInterceptor,
  );
});

afterEach(async () => {
  if (TEST_REQUEST.dbConnection) {
    await TEST_REQUEST.dbConnection.close();
    TEST_REQUEST.dbConnection = null;
  }
});

const setupMockContext = () => {
  const mockHttpArgumentsHost = mock<HttpArgumentsHost>();
  mockHttpArgumentsHost.getRequest.mockReturnValue(TEST_REQUEST);
  mockContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);
};

describe('UserDBConnectionInterceptor - 요청 처리', () => {
  beforeEach(() => {
    mockCallHandler.handle.mockReturnValue(of('test response'));
  });

  it('요청이 오면 DB Connection을 생성한다.', async () => {
    //given&when
    await interceptor.intercept(mockContext, mockCallHandler);

    //then
    expect(TEST_REQUEST.dbConnection).toBeDefined();
    expect(mockCallHandler.handle).toHaveBeenCalled();
  });

  it('DB Connection 제한을 초과하면 에러를 반환한다.', async () => {
    //given&when
    await interceptor.intercept(mockContext, mockCallHandler);

    //then
    await expect(
      interceptor.intercept(mockContext, mockCallHandler),
    ).rejects.toThrowError(ConnectionLimitExceedException);
  });
});

describe('UserDBConnectionInterceptor - 응답 처리', () => {
  it('성공적인 응답에 대해 commit이 호출된다.', async () => {
    //given
    mockCallHandler.handle.mockReturnValue(of('test response'));

    //when
    const observable = await interceptor.intercept(
      mockContext,
      mockCallHandler,
    );
    const commitSpy = jest.spyOn(TEST_REQUEST.dbConnection, 'commit');

    //then
    await expect(lastValueFrom(observable)).resolves.toBe('test response');
    expect(commitSpy).toHaveBeenCalled();
  });

  it('성공적인 응답에 대해 커넥션이 종료된다.', async () => {
    //given
    mockCallHandler.handle.mockReturnValue(of('test response'));

    //when
    const observable = await interceptor.intercept(
      mockContext,
      mockCallHandler,
    );
    const endSpy = jest.spyOn(TEST_REQUEST.dbConnection, 'end');

    //then
    await expect(lastValueFrom(observable)).resolves.toBe('test response');
    expect(endSpy).toHaveBeenCalled();
  });

  it('용량 초과 에러에 대해 rollback이 호출된다.', async () => {
    //given
    mockCallHandler.handle.mockImplementation(() =>
      throwError(() => new DataLimitExceedException()),
    );

    //when
    const observable = await interceptor.intercept(
      mockContext,
      mockCallHandler,
    );
    const rollbackSpy = jest.spyOn(TEST_REQUEST.dbConnection, 'rollback');

    //then
    await expect(lastValueFrom(observable)).rejects.toThrow(
      DataLimitExceedException,
    );
    expect(rollbackSpy).toHaveBeenCalled();
  });

  it('용량 초과 에러에 대해 커넥션이 종료된다.', async () => {
    //given
    mockCallHandler.handle.mockImplementation(() =>
      throwError(() => new DataLimitExceedException()),
    );

    //when
    const observable = await interceptor.intercept(
      mockContext,
      mockCallHandler,
    );
    const endSpy = jest.spyOn(TEST_REQUEST.dbConnection, 'end');

    //then
    await expect(lastValueFrom(observable)).rejects.toThrow(
      DataLimitExceedException,
    );
    expect(endSpy).toHaveBeenCalled();
  });

  it('일반 에러에 대해 rollback이 호출되지 않는다.', async () => {
    //given
    mockCallHandler.handle.mockImplementation(() =>
      throwError(() => new BadGatewayException()),
    );

    //when
    const observable = await interceptor.intercept(
      mockContext,
      mockCallHandler,
    );
    const rollbackSpy = jest.spyOn(TEST_REQUEST.dbConnection, 'rollback');

    //then
    await expect(lastValueFrom(observable)).rejects.toThrow(
      BadGatewayException,
    );
    expect(rollbackSpy).not.toHaveBeenCalled();
  });

  it('일반 에러에 대해 커넥션이 종료된다.', async () => {
    //given
    mockCallHandler.handle.mockImplementation(() =>
      throwError(() => new BadGatewayException()),
    );

    //when
    const observable = await interceptor.intercept(
      mockContext,
      mockCallHandler,
    );
    const endSpy = jest.spyOn(TEST_REQUEST.dbConnection, 'end');

    //then
    await expect(lastValueFrom(observable)).rejects.toThrow(
      BadGatewayException,
    );
    expect(endSpy).toHaveBeenCalled();
  });
});
