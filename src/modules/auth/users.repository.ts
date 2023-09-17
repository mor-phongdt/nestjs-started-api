import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';

export interface UsersRepository extends Repository<User> {
  this: Repository<User>;

  createUser(authCredentialsDto: AuthCredentialsDto): Promise<void>;
}

export const customUsersRepository: Pick<UsersRepository, 'createUser'> = {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, password: hashedPassword });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  },
};
