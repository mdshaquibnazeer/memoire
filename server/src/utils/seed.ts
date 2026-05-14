import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminHash = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@memoire.app' },
    update: {},
    create: {
      email: 'admin@memoire.app',
      username: 'admin',
      passwordHash: adminHash,
      displayName: 'Admin',
      role: 'ADMIN',
      isEmailVerified: true,
    },
  });

  // Create demo user
  const demoHash = await bcrypt.hash('Demo123!', 12);
  const demo = await prisma.user.upsert({
    where: { email: 'demo@memoire.app' },
    update: {},
    create: {
      email: 'demo@memoire.app',
      username: 'demo_user',
      passwordHash: demoHash,
      displayName: 'Demo User',
      isEmailVerified: true,
    },
  });

  // Create demo project
  const project = await prisma.project.upsert({
    where: { slug: 'emma-james-story' },
    update: {},
    create: {
      userId: demo.id,
      slug: 'emma-james-story',
      title: 'Our Love Story',
      subtitle: 'Five years of magic, laughter, and forever',
      theme: 'ROMANTIC_GLOW',
      status: 'PUBLISHED',
      personOneName: 'Emma',
      personTwoName: 'James',
      occasion: 'Anniversary',
      startDate: new Date('2019-06-14'),
      heroConfig: {
        message: 'From the moment I saw you, I knew my life would never be the same. Every day with you is a gift I never want to stop unwrapping.',
      },
      endingConfig: {
        title: 'Forever & Always',
        message: 'Here\'s to a thousand more moments just like these. I love you endlessly.',
        emoji: '🌹',
      },
      publishedAt: new Date(),
    },
  });

  // Add memories
  const memories = [
    { title: 'The Day We Met', description: 'A rainy afternoon at the bookstore changed everything.', date: new Date('2019-06-14'), emoji: '☕', location: 'The Little Bookshop, Portland' },
    { title: 'First Date', description: 'Dinner by the harbor. We talked until midnight.', date: new Date('2019-06-28'), emoji: '🌊', location: 'Waterfront Restaurant' },
    { title: 'Our First Trip Together', description: 'Driving through the coast with no plan but each other.', date: new Date('2019-10-11'), emoji: '🚗', location: 'Pacific Coast Highway' },
    { title: 'You Said Yes', description: 'The moment everything became forever.', date: new Date('2021-12-25'), emoji: '💍', location: 'Mount Rainier, Washington' },
  ];

  for (let i = 0; i < memories.length; i++) {
    await prisma.memory.upsert({
      where: { id: `demo-memory-${i}` },
      update: {},
      create: {
        id: `demo-memory-${i}`,
        projectId: project.id,
        ...memories[i],
        sortOrder: i,
      },
    });
  }

  console.log('✅ Seed complete!');
  console.log('   Admin: admin@memoire.app / Admin123!');
  console.log('   Demo:  demo@memoire.app / Demo123!');
  console.log('   Demo memory: /memory/emma-james-story');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
