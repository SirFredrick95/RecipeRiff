/**
 * Auth API tests — signup, login, token refresh, validation, rate limiting.
 */
import {
  app, db, request, cleanDatabase, createTestUser,
} from './helpers';

beforeEach(() => {
  cleanDatabase();
});

// ─── Signup ──────────────────────────────────────────────

describe('POST /api/auth/signup', () => {
  it('creates a new user and returns token pair', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'new@example.com', password: 'StrongPass1', displayName: 'New User' });

    expect(res.status).toBe(201);
    expect(res.body.user).toMatchObject({
      email: 'new@example.com',
      displayName: 'New User',
    });
    expect(res.body.user.id).toBeDefined();
    expect(typeof res.body.token).toBe('string');
    expect(typeof res.body.refreshToken).toBe('string');
  });

  it('stores email in lowercase', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'USER@Example.COM', password: 'StrongPass1', displayName: 'User' });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('user@example.com');
  });

  it('rejects duplicate email', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ email: 'dupe@example.com', password: 'StrongPass1', displayName: 'User' });

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'dupe@example.com', password: 'StrongPass2', displayName: 'User 2' });

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/already in use/i);
  });

  it('rejects duplicate email case-insensitively', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ email: 'dupe@example.com', password: 'StrongPass1', displayName: 'User' });

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'DUPE@Example.COM', password: 'StrongPass2', displayName: 'User 2' });

    expect(res.status).toBe(409);
  });

  it('rejects missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'a@b.com' });

    expect(res.status).toBe(400);
  });

  it('rejects short password (< 8 chars)', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'a@b.com', password: 'short', displayName: 'User' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/8 characters/);
  });

  it('rejects too-long password (> 128 chars)', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'a@b.com', password: 'x'.repeat(129), displayName: 'User' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/128 characters/);
  });

  it('rejects invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'not-an-email', password: 'StrongPass1', displayName: 'User' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid email/i);
  });

  it('rejects display name over 50 chars', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'a@b.com', password: 'StrongPass1', displayName: 'x'.repeat(51) });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/50 characters/);
  });

  it('hashes the password (not stored in plaintext)', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ email: 'hash@example.com', password: 'MySecret123', displayName: 'User' });

    const row = db.prepare("SELECT password_hash FROM users WHERE email = 'hash@example.com'").get() as { password_hash: string };
    expect(row.password_hash).not.toBe('MySecret123');
    expect(row.password_hash.startsWith('$2')).toBe(true); // bcrypt prefix
  });
});

// ─── Login ───────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ email: 'login@example.com', password: 'LoginPass1', displayName: 'Login User' });
  });

  it('returns token pair on valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'LoginPass1' });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('login@example.com');
    expect(typeof res.body.token).toBe('string');
    expect(typeof res.body.refreshToken).toBe('string');
  });

  it('works with different-case email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'LOGIN@Example.COM', password: 'LoginPass1' });

    expect(res.status).toBe(200);
  });

  it('rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'WrongPassword' });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid/i);
  });

  it('rejects non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'LoginPass1' });

    expect(res.status).toBe(401);
  });

  it('rejects missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com' });

    expect(res.status).toBe(400);
  });
});

// ─── Token Refresh ───────────────────────────────────────

describe('POST /api/auth/refresh', () => {
  let refreshToken: string;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'refresh@example.com', password: 'RefreshPass1', displayName: 'Refresh User' });
    refreshToken = res.body.refreshToken;
  });

  it('returns a new token pair', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe('string');
    expect(typeof res.body.refreshToken).toBe('string');
  });

  it('rotates the refresh token (old one is invalidated)', async () => {
    const first = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });
    expect(first.status).toBe(200);

    // Old token should be invalid now
    const second = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });
    expect(second.status).toBe(401);

    // New token should work
    const third = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: first.body.refreshToken });
    expect(third.status).toBe(200);
  });

  it('rejects invalid refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'garbage-token-value' });

    expect(res.status).toBe(401);
  });

  it('rejects missing refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({});

    expect(res.status).toBe(400);
  });
});

// ─── Auth Middleware ──────────────────────────────────────

describe('Auth middleware on protected routes', () => {
  it('rejects requests with no token', async () => {
    const res = await request(app).get('/api/recipes');
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/no token/i);
  });

  it('rejects requests with invalid token', async () => {
    const res = await request(app)
      .get('/api/recipes')
      .set('Authorization', 'Bearer invalidtokenhere');
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid/i);
  });

  it('accepts requests with valid token', async () => {
    const { token } = await createTestUser();
    const res = await request(app)
      .get('/api/recipes')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});

// ─── Health Check ────────────────────────────────────────

describe('GET /api/health', () => {
  it('returns ok status (no auth required)', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });
});
