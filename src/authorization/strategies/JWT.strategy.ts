import {Request, HttpErrors} from '@loopback/rest';
import {inject} from '@loopback/core';
import {AuthenticationStrategy} from '@loopback/authentication';

import {MyUserProfile} from '../types';
import {JWTService} from '..';
import {TokenServiceBindings} from '../../keys';

export class JWTStrategy implements AuthenticationStrategy {
  name = 'jwt';

  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    protected tokenService: JWTService,
  ) {}

  async authenticate(request: Request): Promise<MyUserProfile> {
    const token: string = this.extractCredentials(request);
    try {
      const user: MyUserProfile = await this.tokenService.verifyToken(token);
      return user;
    } catch (err) {
      Object.assign(err, {
        code: 'INVALID_ACCESS_TOKEN',
        statusCode: 401,
      });
      throw err;
    }
  }

  extractCredentials(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized(`Authorization header not found.`);
    }

    const authHeaderValue = request.headers.authorization;
    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(
        `Authorization header is not of type 'Bearer'.`,
      );
    }

    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2) {
      throw new HttpErrors.Unauthorized(
        `Authorization header value has too many parts.`,
      );
    }

    const token = parts[1];
    return token;
  }
}
