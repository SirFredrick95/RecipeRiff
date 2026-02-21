import { Router } from 'express';

export interface AuthRouter extends Router {
  _clearRateLimiter: () => void;
}
