API Routes Overview

This folder contains all server-side API routes for the application.
They are written using Next.js App Router conventions (app/api/.../route.js).
All protected routes require authentication via an httpOnly cookie auth_token
that is issued during login. The token encodes the user’s id and username.

Structure

app/
  api/
    users/
      route.js        → Signup (create user)
      login/route.js  → Login (set auth cookie)
      logout/route.js → Logout (clear cookie)
      me/route.js     → Current user (session check)
    sets/
      route.js        → List + create sets
      [id]/route.js   → Update + delete single set

Routes

Users
POST /api/users → Sign up
Creates a new user (userdata row with hashed password).
Returns { id, email, username }.

POST /api/users/login → Login
Validates credentials with bcrypt.
Issues JWT in httpOnly cookie auth_token.
Returns { id, username, email }.

POST /api/users/logout → Logout
Clears the cookie to invalidate session.
Returns { ok: true }.

GET /api/users/me → Session check
Verifies auth_token cookie.
Returns { user } if valid, otherwise 401.

-----

Sets (authenticated only)
GET /api/sets → List all sets for current user
Returns rows from sets filtered by sets.user = currentUser.id.

POST /api/sets → Create new set for current user
Body: { name, slug?, words? }
Returns created set row.

PATCH /api/sets/:id → Update a set (owned by current user)
Body: { name?, slug?, words? }
Returns updated row.

DELETE /api/sets/:id → Delete a set (owned by current user)
Returns { ok: true }.

-------

Notes
sets.user is a foreign key → userdata.id (never the raw token).
JWT is only used to identify the user server-side.
The httpOnly cookie is automatically included in requests;
it cannot be accessed from client-side JS for security.
To enforce per-user slug uniqueness, add DB constraint:
ALTER TABLE sets ADD UNIQUE KEY uniq_user_slug (`user`, `slug`);


-----

DATABASE SCHEMA

+-----------+            1 ──────────── *           +------+
| userdata  |-------------------------------------->| sets |
+-----------+       fk: sets.user → userdata.id     +------+
| id (PK)   |                                        | id  |
| email     |                                        | ... |
| username  |                                        |user |
| password_ |                                        +------+
| createdAt |
+-----------+

- Each user can own many sets.
- sets.user is a foreign key to userdata.id.
- slug is unique per user (two different users can reuse the same slug).