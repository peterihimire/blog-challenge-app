# Blog Challenge API

## Overview

The Blog Challenge API is a RESTful service for managing blog posts. It includes functionalities for creating, reading, updating, and deleting blog entries, as well as retrieving user details with thier associated blog post.

## Features

- User authentication and authorization
- CRUD operations for posts and authors
- Comprehensive error handling
- Unit & Integration tests for services and API endpoints

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
  - Authentication
  - Post
  - User
- [Validation & Error Handling](#validation-&-error-handling)
- [Running Tests](#running-tests)
- [Contributing](#contributing)

## Getting Started

Follow these instructions to set up the project on your local machine.

## Prerequisite

- node.js (>= 14.x)
- npm (>= 6.x) or yarn (>= 1.x)
- NestJS
- postgreSQL (>= 12.x)
- Passport JWT
- prisma
- cookie parser
- cors

## Installation

1.  Clone the repository:

    ```sh
    git clone https://github.com/peterihimire/blog-challenge-api.git
    ```

2.  Change directory into the project folder:

    ```sh
    cd blog-challenge-api
    ```

3.  Install dependencies:

    ```sh
    npm install
    ```

4.  Set up the environment variables (See Environment Variables):
    Create a .env file in the root directory and add the necessary environment variables.

    ```sh
    cp .env.example .env
    ```

5.  Run database migration:

    ```sh
    npx prisma migrate dev
    ```

## Running the Server

1.  Start the server:

    ```sh
    npm start
    # or
    yarn start
    ```

2.  Access the API documentation:

    Vsit the postman documentation [Link](https://documenter.getpostman.com/view/12340633/2sA3kUFhDT) of this blog app.

## API Endpoints

All endpoints except authentication endpoints require a valid JWT token. The token should be included in the **Authorization** header as follows:

```makefile
Authorization: Bearer <token>
```

### Authentication

- **Sign Up**:

- URL: /api/auth/signup
- Method: POST
- Auth Required: No
- Request body:

  ```json
  {
    "username": "peter4lovereal",
    "email": "peterihimire@gmail.com",
    "password": "12345678"
  }
  ```

- Response:

  ```json
  {
    "status": "success",
    "msg": "Account registered!",
    "data": {
      "username": "peter4lovereal",
      "email": "peterihimire@gmail.com",
      "acctId": "51a2dee1-b89d-42db-bf85-74380e5ea000",
      "createdAt": "2024-07-19T07:26:17.871Z",
      "updatedAt": "2024-07-19T07:26:17.871Z"
    }
  }
  ```

- **Sign In**:

- URL: /api/auth/signin
- Method: POST
- Auth Required: No
- Request body:

  ```json
  {
    "username": "peter4lovereal",
    "password": "12345678"
  }
  ```

- Response:

  ```json
  {
    "status": "success",
    "msg": "Login successful!",
    "data": {
      "username": "peter4lovereal",
      "email": "peterihimire@gmail.com",
      "acctId": "51a2dee1-b89d-42db-bf85-74380e5ea000",
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MWEyZGVlMS1iODlkLTQyZGItYmY4NS03NDM4MGU1ZWEwMDAiLCJlbWFpbCI6InBldGVyaWhpbWlyZUBnbWFpbC5jb20iLCJpYXQiOjE3MjEzNzM5OTcsImV4cCI6MTcyMTQ0NTk5N30.JnBWEl93qojw5FteXgr7X9guMt0NOy9H9PqtpHGTWZo"
    }
  }
  ```

  - **Refresh Token**:

  - URL: /api/auth/refresh-token
  - Method: POST
  - Auth Required: No
  - Request body:

  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNzc2NGNhMi03MTA0LTQyMmItYjU4MC01Yjc3MWI0Yzg4ODIiLCJlbWFpbCI6InBldGVyaWhpbWlyZUBnbWFpbC5jb20iLCJpYXQiOjE3MjE0MTM2MzQsImV4cCI6MTcyMjAxODQzNH0.usdmLL9hEYcc_vKAo8ueZeOCvZfrFgkx1DbolyQb4ME"
  }
  ```

- Response:

  ```json
  {
    "status": "success",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNzc2NGNhMi03MTA0LTQyMmItYjU4MC01Yjc3MWI0Yzg4ODIiLCJlbWFpbCI6InBldGVyaWhpbWlyZUBnbWFpbC5jb20iLCJpYXQiOjE3MjE0MTM2NTgsImV4cCI6MTcyMTQxNDU1OH0.zTxDP-MC-EYAlr21Dc7DcFlM_mpn3_FF9-Lo2OF1JLg",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNzc2NGNhMi03MTA0LTQyMmItYjU4MC01Yjc3MWI0Yzg4ODIiLCJlbWFpbCI6InBldGVyaWhpbWlyZUBnbWFpbC5jb20iLCJpYXQiOjE3MjE0MTM2NTgsImV4cCI6MTcyMjAxODQ1OH0.jN9Km5pXKnH8mKjG9vPTuddN5QZXlWJjydVUtESPsi4"
    }
  }
  ```

- **Sign Out**:
- URL: /api/auth/signout
- Method: POST
- Auth Required: No

- Response:

  ```json
  {
    "status": "success",
    "msg": "Logout successful!"
  }
  ```

### Post

- **Create a Post**:

- URL: /api/posts/add
- Method: POST
- Auth Required: Yes
- Request body:

  ```json
  {
    "title": "Post Title",
    "content": "Post content",
    "slug": "post-title",
    "excerpt": "Short description of the post",
    "status": "published",
    "publishedDate": "2024-07-18",
    "categories": "failure"
  }
  ```

- Response:

  ```json
  {
    "status": "success",
    "msg": "Post created",
    "data": {
      "title": "First things first",
      "content": "Hello to Peters first post of the day.",
      "excerpt": "some excerpt",
      "slug": "fashion sense",
      "categories": ["fashionista"],
      "publishedDate": "2024-07-22T11:00:00.000Z",
      "status": "published",
      "uuid": "7792f2f9-54b7-4393-bd0e-923e1cf356a0"
    }
  }
  ```

- **Get All Posts**:

- URL: /api/posts
- Method: GET
- Auth Required: Yes

- Response:

  ```json
  {
    "status": "success",
    "msg": "All posts",
    "data": [
      {
        "title": "First things first",
        "content": "Hello to Peters first post of the day.",
        "excerpt": "some excerpt",
        "slug": "fashion sense",
        "categories": ["fashionista"],
        "publishedDate": "2024-07-22T11:00:00.000Z",
        "status": "published",
        "uuid": "7792f2f9-54b7-4393-bd0e-923e1cf356a0"
      }
    ]
  }
  ```

- **Get a Post**:

- URL: /api/posts/:id
- Method: GET
- Auth Required: Yes

- Response:

  ```json
  {
    "status": "success",
    "msg": "Post details",
    "data": {
      "title": "First things first",
      "content": "Hello to Peters first post of the day.",
      "excerpt": "some excerpt",
      "slug": "fashion sense",
      "categories": ["fashionista"],
      "publishedDate": "2024-07-22T11:00:00.000Z",
      "status": "published",
      "uuid": "7792f2f9-54b7-4393-bd0e-923e1cf356a0"
    }
  }
  ```

- **Update a post**:

- URL: /api/posts/:id
- Method: PATCH
- Auth Required: Yes
- Request body:

  ```json
  {
    "title": "Things first",
    "content": "Hello to Peters first post of the day.",
    "excerpt": "some excerpt",
    "slug": "fashion sense",
    "categories": ["fashionista"],
    "publishedDate": "2024-07-22T11:00:00.000Z",
    "status": "unpublished"
  }
  ```

- Response:

  ```json
  {
    "status": "success",
    "msg": "Post updated",
    "data": {
      "title": "First things first",
      "content": "Hello to Peters first post of the day.",
      "excerpt": "some excerpt",
      "slug": "fashion sense",
      "categories": ["fashionista"],
      "publishedDate": "2024-07-22T11:00:00.000Z",
      "status": "published",
      "uuid": "7792f2f9-54b7-4393-bd0e-923e1cf356a0"
    }
  }
  ```

- **Delete a Post**:

- URL: /api/posts/:id
- Method: DELETE
- Auth Required: Yes
- Request body:

- Response:

  ```json
  {
    "status": "success",
    "msg": "Post with id: <id> was deleted."
  }
  ```

  ### User

- **User Info**:

- URL: /api/users/user_info
- Method: GET
- Auth Required: Yes

- Response:

  ```json
  {
    "status": "success",
    "msg": "User details",
    "data": {
      "username": "imolenization",
      "email": "imole@gmail.com",
      "acctId": "2b328446-b09e-491f-849b-410d85fa2ebb",
      "posts": [
        {
          "title": "First things first",
          "excerpt": "some excerpt",
          "content": "Hello to Peters first post of the day.",
          "status": "published",
          "publishedDate": "2024-07-22T11:00:00.000Z",
          "categories": ["fashionista"],
          "slug": "fashion sense",
          "uuid": "7792f2f9-54b7-4393-bd0e-923e1cf356a0"
        }
      ]
    }
  }
  ```

## Validation & Error Handling

The API uses standard HTTP status codes to indicate the success or failure of an API request. Errors are returned in the following JSON format:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Error type"
}
```

**Common Errors**:

- 400 Bad Request: The request was invalid or cannot be otherwise served.
- 401 Unauthorized: Authentication credentials were missing or incorrect.
- 403 Forbidden: The request is understood, but it has been refused or access is not allowed.
- 404 Not Found: The requested resource could not be found.
- 409 Conflict: The request could not be completed due to a conflict with the current state of the resource.

## Running Test

Unit test with jest was integrated. To test the application simply run the below command:

```sh
npm run test
# or
yarn run test
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Create a pull request.
