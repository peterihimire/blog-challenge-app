# Blog Challenge API

## Overview

The Blog Challenge API is a RESTful service for managing blogs. It includes functionalities for creating, reading, updating, and deleting blog entries, as well as retrieving user details.

## Features

- User authentication and authorization
- CRUD operations for blogs and authors
- Comprehensive error handling
- Unit & Integration tests for services and API endpoints

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
  - Authentication
  - Blog
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
    Open your browser and navigate to `http://localhost:3030/api/bookchallenge/v1/api-docs` to view the API documentation once connected to the localhost server or visit postman documentation [Link](https://documenter.getpostman.com/view/12340633/2sA3dvjsbN) to this app.

## API Endpoints

All endpoints except authentication require a valid JWT token. The token should be included in the **Authorization** header as follows:

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

### Blog

- **Create a Blog**:

- URL: /api/blogs/add
- Method: POST
- Auth Required: Yes
- Request body:

  ```json
  {
    "title": "Blog Title",
    "content": "Blog content",
    "slug": "blog-title",
    "excerpt": "Short description of the blog",
    "status": "published",
    "publishedDate": "2024-07-18",
    "categories": "failure"
  }
  ```

- Response:

  ```json
  {
    "status": "success",
    "msg": "Blog created",
    "data": {
      "title": "First things first",
      "content": "Hello to Peters first blog of the day.",
      "excerpt": "some excerpt",
      "slug": "fashion sense",
      "categories": ["fashionista"],
      "publishedDate": "2024-07-22T11:00:00.000Z",
      "status": "published",
      "uuid": "7792f2f9-54b7-4393-bd0e-923e1cf356a0"
    }
  }
  ```

- **Get All Blogs**:

- URL: /api/blogs
- Method: GET
- Auth Required: Yes

- Response:

  ```json
  {
    "status": "success",
    "msg": "All blogs",
    "data": [
      {
        "title": "First things first",
        "content": "Hello to Peters first blog of the day.",
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

- **Get a Blog**:

- URL: /api/blogs/:id
- Method: GET
- Auth Required: Yes

- Response:

  ```json
  {
    "status": "success",
    "msg": "Blog details",
    "data": {
      "title": "First things first",
      "content": "Hello to Peters first blog of the day.",
      "excerpt": "some excerpt",
      "slug": "fashion sense",
      "categories": ["fashionista"],
      "publishedDate": "2024-07-22T11:00:00.000Z",
      "status": "published",
      "uuid": "7792f2f9-54b7-4393-bd0e-923e1cf356a0"
    }
  }
  ```

- **Update a blog**:

- URL: /api/blogs/:id
- Method: PATCH
- Auth Required: Yes
- Request body:

  ```json
  {
    "title": "Things first",
    "content": "Hello to Peters first blog of the day.",
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
    "msg": "Blog updated",
    "data": {
      "title": "First things first",
      "content": "Hello to Peters first blog of the day.",
      "excerpt": "some excerpt",
      "slug": "fashion sense",
      "categories": ["fashionista"],
      "publishedDate": "2024-07-22T11:00:00.000Z",
      "status": "published",
      "uuid": "7792f2f9-54b7-4393-bd0e-923e1cf356a0"
    }
  }
  ```

- **Delete a Blog**:

- URL: /api/blogs/:id
- Method: DELETE
- Auth Required: Yes
- Request body:

- Response:

  ```json
  {
    "status": "success",
    "msg": "Blog with id: <id> was deleted."
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
      "blogs": [
        {
          "title": "First things first",
          "excerpt": "some excerpt",
          "content": "Hello to Peters first blog of the day.",
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

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Create a pull request.