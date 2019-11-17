import {BindingKey} from '@loopback/context';
import {UserPermissionsFn} from './authorization/types';
import {PasswordHasher} from './services/hash-password';
import {TokenService, UserService} from '@loopback/authentication';
import {User} from './models';
import {Credentials} from './authorization';

/**
 * Binding keys used by this component.
 */
export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = 'y1ojj23ad!@#$@od2a5kh';
  export const TOKEN_EXPIRES_IN_VALUE = '600';
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in.seconds',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
  export const USER_PERMISSIONS = BindingKey.create<UserPermissionsFn>(
    'authentication.actions.userPermissions',
  );
}

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'services.hasher',
  );
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<User, Credentials>>(
    'services.user.service',
  );
}
