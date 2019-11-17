import {PermissionKey} from '.';
import {UserProfile} from '@loopback/security';

export interface UserPermissionsFn {
  (
    userPermissions: PermissionKey[],
    requiredPermissions: RequiredPermissions,
  ): boolean;
}

export interface RequiredPermissions {
  required: PermissionKey[];
}

export interface MyUserProfile extends UserProfile {
  id: string;
  email: string;
  name: string;
  permissions: PermissionKey[];
}

export interface Credentials {
  email: string;
  password: string;
}
