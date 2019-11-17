import {
  UserSignUpRequestSchema,
  UserSignUpResponseSchema,
} from './user.controller.spec';

export namespace AdminControllerSpec {
  export namespace SignUp {
    export const REQUEST_BODY = {
      description: 'The input of create user function',
      required: true,
      content: {'application/json': {schema: UserSignUpRequestSchema}},
    };
    export const RESPONSES = {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: UserSignUpResponseSchema}},
      },
    };
  }
}
