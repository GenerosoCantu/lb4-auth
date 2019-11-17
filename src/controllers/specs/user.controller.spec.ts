export const UserSignUpRequestSchema = {
  type: 'object',
  title: 'UserSignUpRequestModel',
  required: ['email', 'password', 'name'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
    },
    name: {type: 'string'},
  },
};

export const UserSignUpResponseSchema = {
  type: 'object',
  title: 'UserSignUpResponseModel',
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    name: {type: 'string'},
    permissions: {
      type: 'array',
      items: {type: 'string'},
    },
  },
};

const UserLoginRequestSchema = {
  type: 'object',
  title: 'UserLoginRequestModel',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {type: 'string'},
  },
};

const UserLoginResponseSchema = {
  type: 'object',
  title: 'UserLoginResponseModel',
  properties: {
    token: {type: 'string'},
  },
};

const UserGetMeResponseSchema = {
  type: 'object',
  title: 'UserGetMeResponseModel',
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    name: {type: 'string'},
    permissions: {
      type: 'array',
      items: {type: 'string'},
    },
  },
};

export namespace UserControllerSpec {
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

  export namespace Login {
    export const REQUEST_BODY = {
      description: 'The input of login function',
      required: true,
      content: {'application/json': {schema: UserLoginRequestSchema}},
    };
    export const RESPONSES = {
      '200': {
        description: 'User authorization token',
        content: {'application/json': {schema: UserLoginResponseSchema}},
      },
    };
  }

  export namespace GetMe {
    export const RESPONSES = {
      '200': {
        description: 'Current user model instance',
        content: {'application/json': {schema: UserGetMeResponseSchema}},
      },
    };
  }
}
