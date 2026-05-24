import { Router } from 'express';
import { getStats, getUsers, getProjects, deleteProject, deleteUser, approveUser, updateUserTemplates } from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.post('/users/:id/approve', approveUser);
router.post('/users/:id/templates', updateUserTemplates);
router.delete('/users/:id', deleteUser);
router.get('/projects', getProjects);
router.delete('/projects/:id', deleteProject);

export default router;
