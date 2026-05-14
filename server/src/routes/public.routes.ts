import { Router } from 'express';
import { getPublicProject } from '../controllers/public.controller';

const router = Router();

router.get('/memory/:slug', getPublicProject);

export default router;
