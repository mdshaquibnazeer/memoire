import { Router } from 'express';
import { generateLoveMessage } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth.middleware';
import { rateLimit } from 'express-rate-limit';

const router = Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'AI rate limit reached. Try again in a minute.' },
});

router.post('/generate-message', authenticate, aiLimiter, generateLoveMessage);

export default router;
