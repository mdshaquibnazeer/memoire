import { Router } from 'express';
import { getStats, getUsers, getProjects, deleteProject, deleteUser } from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/projects', getProjects);
router.delete('/projects/:id', deleteProject);

export default router;
