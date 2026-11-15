# Profile-component

Merge-ready profile module: login and registration forms with empty-field
validation on both the client and the server. Contains only source files that
belong in the merged project — no build tooling, no dependencies, no config.

## Files

| File                                | Purpose                                              |
|-------------------------------------|------------------------------------------------------|
| `frontend/src/validators.js`        | Shared empty-field rules (`validateRequired`, `isBlank`, ...) |
| `frontend/src/Login.jsx`            | Login form + validation wiring                       |
| `frontend/src/Register.jsx`         | Registration form + validation wiring                |
| `backend/main.py`                   | Flask endpoints `/api/login`, `/api/register` + guard |

## How to merge

**Frontend:** copy `frontend/src/*` into your app's `src/`. Requires
`react`, `react-dom` and `react-router-dom` (already provided by the host app).
Then register the routes:

```jsx
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
```

The forms call relative URLs (`/api/login`, `/api/register`), so the host dev
server needs an `/api` proxy to the backend (e.g. Vite
`server.proxy = { "/api": "http://localhost:5000" }`).

**Backend:** copy `main.py` (or move the two routes into your existing Flask
app / Blueprint). Requires Flask. Both endpoints answer with
`{ "message": "..." }`, which is exactly what the forms render.

## Routes

| URL         | Component  | Fields                      |
|-------------|------------|-----------------------------|
| `/login`    | `Login`    | username, password          |
| `/register` | `Register` | username, password, email   |

## API contract

### `POST /api/login`

```json
{ "username": "MohidAhmed", "password": "1234" }
```

| Status | Body                                                             |
|--------|------------------------------------------------------------------|
| 200    | `{"message": "Correct Input"}` or `{"message": "Wrong Input"}`   |
| 400    | `{"message": "Fields can't be empty"}`                           |

### `POST /api/register`

```json
{ "username": "someone", "password": "secret", "userMail": "a@b.com" }
```

| Status | Body                                   |
|--------|----------------------------------------|
| 200    | `{"message": "Successfully Register"}` |
| 400    | `{"message": "Fields can't be empty"}` |

Register currently acknowledges the request only; it does not persist users yet.

## Empty-field validation

Same rule on both sides: **missing, `null`, or whitespace-only counts as empty**
(`"   "` is rejected just like `""`).

Client (`validators.js`):

```js
import { validateRequired } from "./validators";

const errorMessage = validateRequired(values, ["username", "password"]);
if (errorMessage) {
  setError(errorMessage);   // "Fields can't be empty"
  return;                   // fetch() is never called
}
```

Exports: `EMPTY_FIELDS_MESSAGE`, `isBlank`, `findEmptyField`, `hasEmptyFields`,
`validateRequired`. The message renders inline in the same `<h1>` style already
used for `reply.message`, so the form layouts are unchanged, and typing in any
field clears it.

Server (`main.py`): `is_blank()` plus `get_json_body()`, which uses
`request.get_json(silent=True)` and an `isinstance(body, dict)` check. Bad
JSON, a missing body, a non-object body, or blank fields all return
`400 {"message": "Fields can't be empty"}` instead of a Flask error page.
