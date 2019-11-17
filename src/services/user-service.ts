import {inject} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {Credentials} from '../authorization';

import {UserRepository} from '../repositories/user.repository';
import {User} from '../models/user.model';

import {UserService} from '@loopback/authentication';
import {securityId} from '@loopback/security';
import {repository} from '@loopback/repository';

import {PasswordHasher} from './hash-password';
import {PasswordHasherBindings} from '../keys';
import {MyUserProfile} from '../authorization';

export class MyUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const invalidCredentialsError = 'Invalid email or password.';

    const foundUser = await this.userRepository.findOne({
      where: {email: credentials.email},
    });

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }
    const passwordMatched = await this.passwordHasher.comparePassword(
      credentials.password,
      foundUser.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }

  convertToUserProfile(user: User): MyUserProfile {
    return Object.assign({
      [securityId]: user.id,
      name: user.name,
      email: user.email,
      permissions: user.permissions,
    });
  }
}
