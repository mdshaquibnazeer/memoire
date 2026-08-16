import { Router } from 'express';
import multer from 'multer';
import { getPublicProject, submitPublicWish, submitPublicSelfie } from '../controllers/public.controller';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for visitor selfies
});

router.get('/memory/:slug', getPublicProject);
router.post('/memory/:slug/wish', submitPublicWish);
router.post('/memory/:slug/selfie', upload.single('file'), submitPublicSelfie);

export default router;
