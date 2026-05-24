import { Router } from 'express';
import { getStats, getUsers, getProjects, deleteProject, deleteUser, approveUser, updateUserTemplates, suspendUser, updateUserAccess, toggleProjectStatus } from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.post('/users/:id/approve', approveUser);
router.post('/users/:id/templates', updateUserTemplates);
router.post('/users/:id/suspend', suspendUser);
router.post('/users/:id/access', updateUserAccess);
router.delete('/users/:id', deleteUser);
router.get('/projects', getProjects);
router.post('/projects/:id/status', toggleProjectStatus);
router.delete('/projects/:id', deleteProject);

export default router;
