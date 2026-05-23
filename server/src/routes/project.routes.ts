import { Router } from 'express';
import {
  getProjects, getProject, createProject, updateProject,
  publishProject, deleteProject,
  addMemory, updateMemory, deleteMemory,
  addGalleryItem, updateGalleryItem, deleteGalleryItem,
} from '../controllers/project.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All project routes require auth
router.use(authenticate);

// Projects
router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProject);
router.patch('/:id', updateProject);
router.post('/:id/publish', publishProject);
router.delete('/:id', deleteProject);

// Memories
router.post('/:projectId/memories', addMemory);
router.patch('/:projectId/memories/:memoryId', updateMemory);
router.delete('/:projectId/memories/:memoryId', deleteMemory);

// Gallery
router.post('/:projectId/gallery', addGalleryItem);
router.patch('/:projectId/gallery/:itemId', updateGalleryItem);
router.delete('/:projectId/gallery/:itemId', deleteGalleryItem);

export default router;
