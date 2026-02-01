# POST /users/register ✅

## Description

Registers a new user and returns the created user and an authentication token.

> Endpoint path (assumes router is mounted at `/users`): `POST api/users/register`

---

## Request

- **Headers**: `Content-Type: application/json`

- **Body (JSON)**

```json
{
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "secret123"
}
```

### Required fields & validation 🔧

- `fullName.firstName` (string) — **required**, min length **3** characters
- `fullName.lastName` (string) — **required**, min length **3** characters
- `email` (string) — **required**, must be a **valid email**
- `password` (string) — **required**, min length **6** characters

Validation messages are produced by `express-validator` and returned as:

```json
{ "errors": [{ "msg": "...", "param": "...", "location": "body" }] }
```

---

## Responses

- **201 Created** ✅
  - Returned when a user is successfully created.
  - Example body:

```json
{
  "user": {
    "_id": "<userId>",
    "fullName": { "firstName": "John", "lastName": "Doe" },
    "email": "john.doe@example.com",
    "socketId": null
  },
  "token": "<jwt-token>"
}
```

> Note: the `password` field is not returned (it is stored hashed and set `select: false` in the model).

- **400 Bad Request** ⚠️
  - Returned when request validation fails. Responds with `{ errors: [...] }` as shown above.

- **409 Conflict** ⚠️
  - Intended for cases where a user with the supplied email already exists. Example body:

```json
{ "message": "User with this email already exists" }
```

- **500 Internal Server Error** 🔥
  - Returned for unexpected server errors. Example body:

```json
{ "message": "Internal Server Error" }
```

---

# POST /users/login ✅

## Description

Authenticates an existing user and returns the user object and a JWT token.

> Endpoint path (assumes router is mounted at `/users`): `POST api/users/login`

---

## Request

- **Headers**: `Content-Type: application/json`

- **Body (JSON)**

```json
{
  "email": "john.doe@example.com",
  "password": "secret123"
}
```

### Required fields & validation 🔧

- `email` (string) — **required**, must be a **valid email**
- `password` (string) — **required**, min length **6** characters

Validation errors are returned as:

```json
{ "errors": [{ "msg": "...", "param": "...", "location": "body" }] }
```

---

## Responses

- **200 OK** ✅
  - Returned when credentials are valid.
  - Example body:

```json
{
  "user": {
    "_id": "<userId>",
    "fullName": { "firstName": "John", "lastName": "Doe" },
    "email": "john.doe@example.com",
    "socketId": null
  },
  "token": "<jwt-token>"
}
```

> Note: the controller uses `.select('+password')` to verify credentials. The response should **not** include the `password` field; ensure the server excludes it before sending responses.

- **400 Bad Request** ⚠️
  - Returned when validation fails or credentials are invalid.
  - Validation errors: `{ errors: [...] }`.
  - Invalid credentials example: `{ "message": "Invalid email or password" }`.

- **500 Internal Server Error** 🔥
  - Returned for unexpected server errors. Example body:

```json
{ "message": "Internal Server Error" }
```

---

## Implementation notes

- Passwords are hashed using `bcryptjs` (`userModel.hashPassword`) before saving.
- Login verifies credentials using `userModel.findOne({ email }).select('+password')` and `user.comparePassword`.
- Tokens are generated with `jsonwebtoken` (`user.generateAuthToken`).
- Relevant files: `Routes/user.route.js`, `controllers/user.controller.js`, `Services/user.service.js`, `Models/user.model.js`.

---

If you want, I can also add example cURL and Postman snippets for quick testing. 💡

---

# POST /captains/register ✅

## Description

Registers a new captain (driver) and returns the created captain and an authentication token.

> Endpoint path (assumes router is mounted at `/captains`): `POST api/captains/register`

---

## Request

- **Headers**: `Content-Type: application/json`

- **Body (JSON)**

```json
{
  "fullName": {
    "firstName": "Jane",
    "lastName": "Rider"
  },
  "email": "jane.rider@example.com",
  "password": "secret123",
  "vehicle": {
    "color": "red",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Required fields & validation 🔧

- `fullName.firstName` (string) — **required**, min length **3** characters
- `fullName.lastName` (string) — **required**, min length **3** characters
- `email` (string) — **required**, must be a **valid email**
- `password` (string) — **required**, min length **6** characters
- `vehicle.color` (string) — **required**
- `vehicle.plate` (string) — **required**, min length **3** characters
- `vehicle.capacity` (number) — **required**, integer, min **1**
- `vehicle.vehicleType` (string) — **required**, one of `bike`, `car`, `van`, `auto`

Validation messages are produced by `express-validator` and returned as:

```json
{ "errors": [{ "msg": "...", "param": "...", "location": "body" }] }
```

---

## Responses

- **201 Created** ✅
  - Returned when a captain is successfully created.
  - Example body:

```json
{
  "captain": {
    "_id": "<captainId>",
    "fullName": { "firstName": "Jane", "lastName": "Rider" },
    "email": "jane.rider@example.com",
    "vehicle": {
      "color": "red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  },
  "token": "<jwt-token>"
}
```

> Note: the `password` field is not returned (it is stored hashed and set `select: false` in the model).

- **400 Bad Request** ⚠️
  - Returned when request validation fails. Responds with `{ errors: [...] }` as shown above.

- **409 Conflict** ⚠️
  - Returned when a captain with the supplied email already exists. Example body:

```json
{ "message": "Captain with this email already exists" }
```

- **500 Internal Server Error** 🔥
  - Returned for unexpected server errors. Example body:

```json
{ "message": "Internal Server Error" }
```

---

## Implementation notes

- The route performs validation via `express-validator`.
- The controller hashes the password (`CaptainModel.hashPassword`) and delegates creation to `Services/captain.service.js`.
- The service previously had a bug where `captainModel.create` was used (undefined); it was corrected to `CaptainModel.create` and now normalizes email with `email.toLowerCase()` before saving.
- Tokens are generated with `jsonwebtoken` (`captain.generateAuthToken`).
- Relevant files: `Routes/captain.route.js`, `controllers/captain.controller.js`, `Services/captain.service.js`, `Models/captain.model.js`.

---

# POST /captains/login ✅

## Description

Authenticates an existing captain and returns the captain object and a JWT token.

> Endpoint path (assumes router is mounted at `/captains`): `POST api/captains/login`

---

## Request

- **Headers**: `Content-Type: application/json`

- **Body (JSON)**

```json
{
  "email": "jane.rider@example.com",
  "password": "secret123"
}
```

### Required fields & validation 🔧

- `email` (string) — **required**, must be a **valid email**
- `password` (string) — **required**, min length **6** characters

Validation errors are returned as:

```json
{ "errors": [{ "msg": "...", "param": "...", "location": "body" }] }
```

---

## Responses

- **200 OK** ✅
  - Returned when credentials are valid.
  - Example body:

```json
{
  "captain": {
    "_id": "<captainId>",
    "fullName": { "firstName": "Jane", "lastName": "Rider" },
    "email": "jane.rider@example.com",
    "vehicle": {
      "color": "red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  },
  "token": "<jwt-token>"
}
```

- **400 Bad Request** ⚠️
  - Returned when validation fails or credentials are invalid. Example bodies:

```json
{ "errors": [...] }
```

```json
{ "error": "Invalid email" }
```

```json
{ "error": "Invalid password" }
```

- **500 Internal Server Error** 🔥
  - Returned for unexpected server errors. Example body:

```json
{ "message": "Internal Server Error" }
```

---

# GET /captains/profile ✅

## Description

Returns the authenticated captain's profile. This route is **protected** — requires a valid captain JWT token sent either as a cookie (`token`) or Authorization header (`Bearer <token>`).

> Endpoint path (assumes router is mounted at `/captains`): `GET api/captains/profile`

---

## Request

- **Headers**: `Authorization: Bearer <jwt-token>` (or cookie `token`)

---

## Responses

- **200 OK** ✅
  - Returns the current captain's profile:

```json
{
  "captain": {
    "_id": "<captainId>",
    "fullName": { "firstName": "Jane", "lastName": "Rider" },
    "email": "jane.rider@example.com",
    "vehicle": {
      "color": "red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

- **401 Unauthorized** ⚠️
  - Returned when token is missing, blacklisted, or invalid. Example bodies:

```json
{ "message": "No token, authorization denied" }
```

```json
{ "message": "Token is not valid" }
```

- **403 Forbidden** ⚠️
  - Returned when a **user** token is supplied instead of a captain token:

```json
{ "message": "Token belongs to a user; please log in as a captain" }
```

- **404 Not Found** ⚠️
  - Returned when a token is valid but the captain no longer exists:

```json
{ "message": "Captain not found for provided token" }
```

---

# GET /captains/logout ✅

## Description

Logs out the authenticated captain by blacklisting their token (stored in `BlackListToken`) and clearing the auth cookie (if used). Requires a valid token (cookie or Authorization header).

> Endpoint path (assumes router is mounted at `/captains`): `GET api/captains/logout`

---

## Request

- **Headers**: `Authorization: Bearer <jwt-token>` (or cookie `token`)

---

## Responses

- **200 OK** ✅
  - Logout successful:

```json
{ "message": "Logout successful" }
```

- **400 Bad Request** ⚠️
  - Returned when no token is provided:

```json
{ "error": "No token provided" }
```

- **500 Internal Server Error** 🔥
  - Returned when logout fails (e.g., database error):

```json
{ "error": "Failed to logout" }
```

---

## Implementation notes

- Authentication middleware: `middleware/auth.middleware.js` (`captainAuth`) verifies tokens, checks `BlackListToken`, and attaches `req.captain` when valid.
- Logout adds the token to `Models/blackListToken.js` and clears the `token` cookie.
- Relevant files: `Routes/captain.route.js`, `controllers/captain.controller.js`, `middleware/auth.middleware.js`, `models/blackListToken.js`, `models/captain.model.js`.

---
