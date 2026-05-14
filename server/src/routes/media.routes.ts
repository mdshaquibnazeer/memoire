// media.routes.ts
import { Router } from 'express';
import multer from 'multer';
import { uploadMedia, deleteMedia, getUserMedia } from '../controllers/media.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

router.use(authenticate);
router.post('/upload', upload.single('file'), uploadMedia);
router.get('/', getUserMedia);
router.delete('/:id', deleteMedia);

export default router;
