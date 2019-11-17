import {inject} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {TokenService} from '@loopback/authentication';
import {securityId} from '@loopback/security';
import {repository} from '@loopback/repository';

import {MyUserProfile} from '../types';
import {TokenServiceBindings} from '../../keys';
import {UserRepository} from '../../repositories';

import {promisify} from 'util';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JWTService implements TokenService {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    private jwtExpiresIn: string,
  ) {}

  async verifyToken(token: string): Promise<MyUserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null`,
      );
    }

    let userProfile: MyUserProfile;

    try {
      // Decode user profile from token
      const decodedToken = await verifyAsync(token, this.jwtSecret);
      // Don't copy over  token field 'iat' and 'exp', nor 'email' to user profile
      userProfile = Object.assign({
        [securityId]: decodedToken.id,
        name: decodedToken.name,
        email: decodedToken.email,
        permissions: decodedToken.permissions,
      });
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );
    }
    return userProfile;
  }

  async generateToken(userProfile: MyUserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error generating token : userProfile is null',
      );
    }

    const userInfoForToken = {
      id: userProfile[securityId],
      name: userProfile.name,
      email: userProfile.email,
      permissions: userProfile.permissions,
    };

    // Generate a JSON Web Token
    let token: string;
    try {
      token = await signAsync(userInfoForToken, this.jwtSecret, {
        expiresIn: Number(this.jwtExpiresIn),
      });
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error encoding token : ${error}`);
    }

    return token;
  }
}
