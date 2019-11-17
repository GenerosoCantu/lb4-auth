export const enum PermissionKey {
  // For accessing own (logged in user) profile
  ViewOwnUser = 'ViewOwnUser',
  // For creating a user
  CreateUser = 'CreateUser',
  // For updating own (logged in user) profile
  UpdateOwnUser = 'UpdateOwnUser',
  // For deleting a user
  DeleteOwnUser = 'DeleteOwnUser',

  // Admin
  // For updating other users profile
  UpdateAnyUser = 'UpdateAnyUser',
  // For accessing other users profile.
  ViewAnyUser = 'ViewAnyUser',
  // For deleting a user
  DeleteAnyUser = 'DeleteAnyUser',
}

export const UserPermissions = [
  PermissionKey.ViewOwnUser,
  PermissionKey.CreateUser,
  PermissionKey.UpdateOwnUser,
  PermissionKey.DeleteOwnUser,
];

export const AdminPermissions = [
  PermissionKey.ViewOwnUser,
  PermissionKey.CreateUser,
  PermissionKey.UpdateOwnUser,
  PermissionKey.DeleteOwnUser,
  PermissionKey.UpdateAnyUser,
  PermissionKey.ViewAnyUser,
  PermissionKey.DeleteAnyUser,
];
