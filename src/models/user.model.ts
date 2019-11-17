import {Entity, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid';
import {PermissionKey} from '../authorization';

@model({
  name: 'User',
  settings: {
    hiddenProperties: ['password'],
    indexes: {
      uniqueEmail: {
        keys: {
          email: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  },
})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    default: () => uuid(),
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 250,
      minLength: 6,
    },
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 25,
      minLength: 8,
    },
  })
  password: string;

  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 50,
    },
  })
  name: string;

  @property.array(String)
  permissions: PermissionKey[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
