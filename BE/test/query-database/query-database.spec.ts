import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { SingleMySQLAdapter } from '../../src/config/query-database/single-mysql.adapter';

jest.setTimeout(10000);

describe('싱글 MYSQL(Query DB) 어댑터 테스트', () => {
  let singleMysqlAdapter: SingleMySQLAdapter;
  let container: StartedMySqlContainer;

  beforeAll(async () => {
    const ROOT = 'root';
    const PASSWORD = 'password';

    container = await new MySqlContainer().withRootPassword(PASSWORD).start();

    process.env.QUERY_DB_HOST = container.getHost();
    process.env.QUERY_DB_USER = ROOT;
    process.env.QUERY_DB_PASSWORD = PASSWORD;
    process.env.QUERY_DB_PORT = container.getMappedPort(3306).toString();

    singleMysqlAdapter = new SingleMySQLAdapter();
  });

  afterAll(async () => {
    await container.stop();
  });

  it('커넥션 생성 시 유저 커넥션 리스트에 커넥션이 추가된다.', async () => {
    const identify = 'identify';
    await singleMysqlAdapter.createConnection(identify);

    expect(singleMysqlAdapter.getConnection(identify)).toBeDefined();
  });

  it('식별자를 통해 해당 connection에 쿼리를 실행할 수 있다.', async () => {
    const identify = 'identify';

    const userConnection = singleMysqlAdapter['userConnectionList'][identify];
    const CREATE_TABLE_USERS = `CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(50));`;
    const INSERT_USER = `INSERT INTO users (name) VALUES (?);`;
    const SELECT_ALL_USERS = `SELECT * FROM users;`;

    await userConnection.execute(CREATE_TABLE_USERS);
    await userConnection.execute(INSERT_USER, ['John Doe']);

    const [rows] = await userConnection.execute(SELECT_ALL_USERS);

    expect(rows).toEqual([{ id: 1, name: 'John Doe' }]);
  });

  it('식별자를 통해 커넥션을 종료하면 유저 커넥션 리스트에 삭제된다.', async () => {
    const identify = 'identify';
    await singleMysqlAdapter.closeConnection(identify);

    expect(singleMysqlAdapter.getConnection(identify)).toBeUndefined();
  });
});
