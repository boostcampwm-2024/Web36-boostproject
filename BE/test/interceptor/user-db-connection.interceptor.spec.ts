import { UserDBConnectionInterceptor } from '../../src/interceptors/user-db-connection.interceptor';
import {
  BadGatewayException,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { MySqlContainer } from '@testcontainers/mysql';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, of, throwError } from 'rxjs';
import { mock, MockProxy } from 'jest-mock-extended';
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
let mockCallHandler: MockProxy<CallHandler>;

const MOCK_SESSION_ID = 'db12345678';
const MOCK_REQUEST = {
  sessionID: MOCK_SESSION_ID,
  dbConnection: null,
};

beforeAll(async () => {
  dbContainer = await new MySqlContainer()
    .withUsername(MOCK_SESSION_ID.substring(0, 10))
    .withUserPassword(MOCK_SESSION_ID)
    .withDatabase(MOCK_SESSION_ID)
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

  //mock callHandler
  mockCallHandler = mock<CallHandler>();

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
  if (MOCK_REQUEST.dbConnection) {
    await MOCK_REQUEST.dbConnection.close();
    MOCK_REQUEST.dbConnection = null;
  }
});

const setupMockContext = () => {
  const mockHttpArgumentsHost = mock<HttpArgumentsHost>();
  mockHttpArgumentsHost.getRequest.mockReturnValue(MOCK_REQUEST);
  mockContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);
};

describe('UserDBConnectionInterceptor - 요청 처리', () => {
  beforeEach(() => {
    mockCallHandler.handle.mockReturnValue(of('test response'));
  });

  it('DB Connection을 성공적으로 생성한다.', async () => {
    //given&when
    await interceptor.intercept(mockContext, mockCallHandler);

    //then
    expect(MOCK_REQUEST.dbConnection).toBeDefined();
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
  it('성공적인 요청에 대해 commit이 호출된다.', async () => {
    //given
    mockCallHandler.handle.mockReturnValue(of('test response'));

    //when
    const observable = await interceptor.intercept(
      mockContext,
      mockCallHandler,
    );
    const commitSpy = jest.spyOn(MOCK_REQUEST.dbConnection, 'commit');

    //then
    await expect(lastValueFrom(observable)).resolves.toBe('test response');
    expect(commitSpy).toHaveBeenCalled();
  });

  it('성공적인 요청에 대해 end가 호출된다.', async () => {
    //given
    mockCallHandler.handle.mockReturnValue(of('test response'));

    //when
    const observable = await interceptor.intercept(
      mockContext,
      mockCallHandler,
    );
    const endSpy = jest.spyOn(MOCK_REQUEST.dbConnection, 'end');

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
    const rollbackSpy = jest.spyOn(MOCK_REQUEST.dbConnection, 'rollback');

    //then
    await expect(lastValueFrom(observable)).rejects.toThrow(
      DataLimitExceedException,
    );
    expect(rollbackSpy).toHaveBeenCalled();
  });

  it('용량 초과 에러에 대해 end가 호출된다.', async () => {
    //given
    mockCallHandler.handle.mockImplementation(() =>
      throwError(() => new DataLimitExceedException()),
    );

    //when
    const observable = await interceptor.intercept(
      mockContext,
      mockCallHandler,
    );
    const endSpy = jest.spyOn(MOCK_REQUEST.dbConnection, 'end');

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
    const rollbackSpy = jest.spyOn(MOCK_REQUEST.dbConnection, 'rollback');

    //then
    await expect(lastValueFrom(observable)).rejects.toThrow(
      BadGatewayException,
    );
    expect(rollbackSpy).not.toHaveBeenCalled();
  });

  it('일반 에러에 대해 end가 호출된다.', async () => {
    //given
    mockCallHandler.handle.mockImplementation(() =>
      throwError(() => new BadGatewayException()),
    );

    //when
    const observable = await interceptor.intercept(
      mockContext,
      mockCallHandler,
    );
    const endSpy = jest.spyOn(MOCK_REQUEST.dbConnection, 'end');

    //then
    await expect(lastValueFrom(observable)).rejects.toThrow(
      BadGatewayException,
    );
    expect(endSpy).toHaveBeenCalled();
  });
});
