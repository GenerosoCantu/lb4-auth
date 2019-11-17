import {
  repository
} from '@loopback/repository';
import {
  post,
  param,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {AdminControllerSpec} from './specs';
import * as _ from 'lodash';

// Import for Authentication Process
import {
  AdminPermissions,
  validateCredentials,
} from '../authorization';

export class AdminController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  /**
   * Create admin account
   *
   * @param adminCode
   * @param user
   */
  @post('/admin', {responses: AdminControllerSpec.SignUp.RESPONSES})
  async create(
    @param.query.string('adminCode') adminCode: string,
    @requestBody(AdminControllerSpec.SignUp.REQUEST_BODY) user: User,
  ): Promise<User> {
    // Check admin code to continue this process
    if (!this.isValidAdminCode(adminCode)) {
      throw new HttpErrors.Forbidden('WRONG_ADMIN_CODE');
    }

    // Ensure a valid email value and password value
    validateCredentials(_.pick(user, ['email', 'password']));

    // Set user permissions
    user.permissions = AdminPermissions;

    return this.databaseAddNewUser(user);
  }

  isValidAdminCode(code: string): boolean {
    return code === '777888';
  }

  async databaseAddNewUser(user: User): Promise<User> {
    try {
      // Create the new user
      const savedUser = await this.userRepository.create(user);
      delete savedUser.id;
      delete savedUser.password;
      return savedUser;
    } catch (error) {
      // MongoError 11000 duplicate key
      if (error.code === 11000 && error.errmsg.includes('email')) {
        throw new HttpErrors.Conflict('Email value is already taken');
      } else {
        throw error;
      }
    }
  }
}
