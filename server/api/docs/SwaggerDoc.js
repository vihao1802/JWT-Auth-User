import { text } from "express";
import swaggerJsDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "JWT USER API",
      version: "1.0.0",
      description: "A simple project with JWT authentication,authorization API",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Main server",
      },
      {
        url: "http://localhost:8080",
        description: "Sub server",
      },
    ],
    tags: [
      {
        name: "authen - author",
        description:
          "Endpoints related to JWT authentication and authorization.",
      },
      {
        name: "user",
        description: "Endpoints related to  user management.",
      },
    ],
    paths: {
      "/v1/auth/register": {
        post: {
          summary: "Create user",
          tags: ["authen - author"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: {
                      type: "string",
                    },
                    email: {
                      type: "string",
                    },
                    password: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          responses: {
            500: {
              description: "Register failed",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Register failed",
                      },
                      error: {
                        type: "string",
                        example: "Error",
                      },
                    },
                  },
                },
              },
            },
            200: {
              description: "Register successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Create successful",
                      },
                      data: {
                        type: "object",
                        properties: {
                          username: {
                            type: "string",
                          },
                          email: {
                            type: "string",
                          },
                          password: {
                            type: "string",
                          },
                          admin: {
                            type: "boolean",
                            default: false,
                          },
                          _id: {
                            type: "string",
                          },
                          createdAt: {
                            type: "string",
                          },
                          updatedAt: {
                            type: "string",
                          },
                          __v: {
                            type: "integer",
                          },
                        },
                      },
                    },
                    required: ["username", "email", "password"],
                  },
                },
              },
            },
          },
        },
      },
      "/v1/auth/login": {
        post: {
          summary: "Login user",
          tags: ["authen - author"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: {
                      type: "string",
                    },
                    password: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Login successful",
                      },
                      others: {
                        type: "object",
                        properties: {
                          username: {
                            type: "string",
                          },
                          email: {
                            type: "string",
                          },
                          password: {
                            type: "string",
                          },
                          admin: {
                            type: "boolean",
                            default: false,
                          },
                          _id: {
                            type: "string",
                          },
                          createdAt: {
                            type: "string",
                          },
                          updatedAt: {
                            type: "string",
                          },
                          __v: {
                            type: "integer",
                          },
                        },
                      },
                      accessToken: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/user/getallusers": {
        get: {
          summary: "Get all users",
          tags: ["user"],
          parameters: [
            {
              name: "token",
              in: "header",
              description: "Authentication token for accessing the API",
              required: true,
              schema: {
                type: "string",
              },
              example: "Bearer access_token",
            },
          ],
          responses: {
            200: {
              description: "Get users successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Get all users successful",
                      },
                      data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            username: {
                              type: "string",
                            },
                            email: {
                              type: "string",
                            },
                            password: {
                              type: "string",
                            },
                            admin: {
                              type: "boolean",
                              default: false,
                            },
                            _id: {
                              type: "string",
                            },
                            createdAt: {
                              type: "string",
                            },
                            updatedAt: {
                              type: "string",
                            },
                            __v: {
                              type: "integer",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            403: {
              description: "Invalid token",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "string",
                        example: "Forbidden",
                      },
                      message: {
                        type: "string",
                        example: "Invalid token",
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: "Not authenticated",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "string",
                        example: "Not authenticated",
                      },
                      message: {
                        type: "string",
                        example:
                          "You're not sign in or haven't passed access token yet",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/v1/user/deleteuser/{id}": {
        delete: {
          summary: "Delete user",
          tags: ["user"],
          parameters: [
            {
              name: "token",
              in: "header",
              description: "Authentication token for accessing the API",
              required: true,
              schema: {
                type: "string",
              },
              example: "Bearer access_token",
            },
            {
              name: "id",
              in: "path",
              description: "User id",
              required: true,
              schema: {
                type: "string",
              },
              example: "user_id",
            },
          ],
          responses: {
            200: {
              description: "Delete successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Delete user successful",
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: "Not found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "User not found",
                      },
                    },
                  },
                },
              },
            },
            403: {
              description: "Not allowed",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "You're not allowed to delete other",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  apis: ["../routes/api.js"],
};

const specs = swaggerJsDoc(options);

export default specs;
