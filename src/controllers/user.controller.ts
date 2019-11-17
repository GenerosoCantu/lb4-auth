import {repository} from '@loopback/repository';
import {post, get, requestBody, HttpErrors} from '@loopback/rest';
import {inject} from '@loopback/core';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {UserControllerSpec} from './specs';
import * as _ from 'lodash';

/**
 * Import for Authentication Process
 */
import {securityId, SecurityBindings} from '@loopback/security';
import {
  authenticate,
  TokenService,
  UserService,
} from '@loopback/authentication';
import {
  Credentials,
  PermissionKey,
  validateCredentials,
  MyUserProfile,
} from '../authorization';
import {
  TokenServiceBindings,
  PasswordHasherBindings,
  UserServiceBindings,
} from '../keys';
import {PasswordHasher} from '../services';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';
import {UserPermissions} from '../authorization/permission-key';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
  ) {}

  /**
   * Sign Up
   *
   * @param user
   */
  @post('/users', {responses: UserControllerSpec.SignUp.RESPONSES})
  async create(
    @requestBody(UserControllerSpec.SignUp.REQUEST_BODY)
    user: User,
  ): Promise<User> {
    // Ensure a valid email value and password value
    validateCredentials(_.pick(user, ['email', 'password']));

    // Set user permissions
    user.permissions = UserPermissions;

    // Encrypt the password
    const hashedPassword: string = await this.passwordHasher.hashPassword(
      user.password,
    );
    user.password = hashedPassword;

    return this.databaseAddNewUser(user);
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

  /**
   * Login
   *
   * @param credentials
   */
  @post('/users/login', {responses: UserControllerSpec.Login.RESPONSES})
  async login(
    @requestBody(UserControllerSpec.Login.REQUEST_BODY)
    credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }

  /**
   * Get current user profile
   *
   * @param currentUserProfile
   */
  @get('/users/me', {
    security: OPERATION_SECURITY_SPEC,
    responses: UserControllerSpec.GetMe.RESPONSES,
  })
  @authenticate('jwt', {
    required: [PermissionKey.ViewOwnUser],
  })
  async printCurrentUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: MyUserProfile,
  ): Promise<MyUserProfile> {
    delete currentUserProfile[securityId];
    return currentUserProfile;
  }
}
