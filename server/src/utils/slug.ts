import { prisma } from '../config/prisma';

export const generateSlug = async (title: string, userId: string): Promise<string> => {
  // Create base slug
  let base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);

  if (!base) base = 'memory';

  // Check uniqueness
  let slug = base;
  let counter = 0;

  while (true) {
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (!existing) break;
    counter++;
    slug = `${base}-${counter}`;
  }

  return slug;
};
