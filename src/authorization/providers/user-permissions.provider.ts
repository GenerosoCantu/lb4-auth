import {Provider} from '@loopback/context';
import {PermissionKey, UserPermissionsFn, RequiredPermissions} from '..';
import {intersection} from 'lodash';

export class UserPermissionsProvider implements Provider<UserPermissionsFn> {
  constructor() {}

  value(): UserPermissionsFn {
    return (userPermissions, requiredPermissions) =>
      this.action(userPermissions, requiredPermissions);
  }

  action(
    userPermissions: PermissionKey[],
    requiredPermissions: RequiredPermissions,
  ): boolean {
    return (
      intersection(userPermissions, requiredPermissions.required).length ===
      requiredPermissions.required.length
    );
  }
}
