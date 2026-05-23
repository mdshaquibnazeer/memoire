import { Router } from 'express';
import { getPublicProject, submitPublicWish } from '../controllers/public.controller';

const router = Router();

router.get('/memory/:slug', getPublicProject);
router.post('/memory/:slug/wish', submitPublicWish);

export default router;
