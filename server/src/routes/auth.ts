import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/init';
import { signAccessToken } from '../utils/token';
import type { AuthRouter } from '../types/auth-router';
import type { RateLimitEntry, UserRow, RefreshTokenRow } from '../types';

const router = express.Router() as AuthRouter;

// Simple in-memory rate limiter for auth endpoints
const attempts = new Map<string, RateLimitEntry>();
const RATE_WINDOW = 15 * 60 * 1000; // 15 min
const MAX_ATTEMPTS = 10;

function rateLimit(key: string): boolean {
  const now = Date.now();
  const record = attempts.get(key) || { count: 0, resetAt: now + RATE_WINDOW };
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + RATE_WINDOW;
  }
  record.count++;
  attempts.set(key, record);
  return record.count > MAX_ATTEMPTS;
}

// POST /api/auth/signup
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body) { res.status(400).json({ error: 'Request body required' }); return; }

    const { email, password, displayName } = req.body as { email?: string; password?: string; displayName?: string };

    if (!email || !password || !displayName) {
      res.status(400).json({ error: 'Email, password, and display name are required' }); return;
    }
    if (password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters' }); return;
    }
    if (password.length > 128) {
      res.status(400).json({ error: 'Password must be at most 128 characters' }); return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 254) {
      res.status(400).json({ error: 'Invalid email format' }); return;
    }
    if (displayName.trim().length > 50) {
      res.status(400).json({ error: 'Display name must be at most 50 characters' }); return;
    }

    const ip = req.ip || 'unknown';
    if (rateLimit(`signup:${ip}`)) {
      res.status(429).json({ error: 'Too many requests. Please try again later.' }); return;
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim()) as UserRow | undefined;
    if (existing) {
      res.status(409).json({ error: 'Email already in use' }); return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = db.prepare(
      'INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)'
    ).run(email.toLowerCase().trim(), passwordHash, displayName.trim());

    const userId = Number(result.lastInsertRowid);
    const token = signAccessToken({ userId, email: email.toLowerCase().trim() });

    const refreshToken = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)').run(userId, refreshToken, expiresAt);

    res.status(201).json({
      user: { id: userId, email: email.toLowerCase().trim(), displayName: displayName.trim() },
      token,
      refreshToken
    });
  } catch (err: unknown) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body) { res.status(400).json({ error: 'Request body required' }); return; }

    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' }); return;
    }

    const ip = req.ip || 'unknown';
    if (rateLimit(`login:${ip}`)) {
      res.status(429).json({ error: 'Too many requests. Please try again later.' }); return;
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim()) as UserRow | undefined;
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' }); return;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' }); return;
    }

    const token = signAccessToken({ userId: user.id, email: user.email });

    // Clean up old refresh tokens for this user
    db.prepare("DELETE FROM refresh_tokens WHERE user_id = ? AND expires_at < datetime('now')").run(user.id);

    const refreshToken = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)').run(user.id, refreshToken, expiresAt);

    res.json({
      user: { id: user.id, email: user.email, displayName: user.display_name },
      token,
      refreshToken
    });
  } catch (err: unknown) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', (req: Request, res: Response): void => {
  try {
    if (!req.body) { res.status(400).json({ error: 'Request body required' }); return; }

    const { refreshToken } = req.body as { refreshToken?: string };

    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token is required' }); return;
    }

    const stored = db.prepare(
      "SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > datetime('now')"
    ).get(refreshToken) as RefreshTokenRow | undefined;

    if (!stored) {
      res.status(401).json({ error: 'Invalid or expired refresh token' }); return;
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(stored.user_id) as UserRow | undefined;
    if (!user) {
      res.status(401).json({ error: 'User not found' }); return;
    }

    // Delete old token (rotation)
    db.prepare('DELETE FROM refresh_tokens WHERE id = ?').run(stored.id);

    // Issue new pair
    const newToken = signAccessToken({ userId: user.id, email: user.email });
    const newRefreshToken = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)').run(user.id, newRefreshToken, expiresAt);

    res.json({ token: newToken, refreshToken: newRefreshToken });
  } catch (err: unknown) {
    console.error('Refresh error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Exposed for testing — clear rate limiter state between test runs
router._clearRateLimiter = () => attempts.clear();

export default router;
