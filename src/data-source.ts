import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './modules/auth/users.entity';

export const options: DataSourceOptions = {
  type: 'postgres',
  synchronize: true,
  host: 'db',
  port: 5431,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: [User],
};

// Use with TypeORM CLI
export const AppDataSource = new DataSource(options);
