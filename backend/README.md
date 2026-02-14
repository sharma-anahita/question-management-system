# Question Sheet — Backend

Node.js + Express + TypeScript backend for the Question Sheet app.

Quick start

1. Copy `.env.example` to `.env` and set values.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Run in dev:

```bash
npm run dev
```

Build for production:

```bash
npm run build
npm start
```

APIs

- `POST /api/auth/register` — register
- `POST /api/auth/login` — login
- `GET /api/sheet` — get user's sheet (auth required)
- `PUT /api/sheet` — update user's sheet (auth required)

Environment

- `MONGODB_URI`, `JWT_SECRET`, `PORT`
