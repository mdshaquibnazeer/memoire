const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('12345678', 12);
  const user = await prisma.user.create({
    data: {
      email: 'testuser_12345678@example.com',
      username: 'test_user_12345678',
      passwordHash: passwordHash,
      displayName: 'Test User 12345678',
      isApproved: true,
      isEmailVerified: true
    }
  });
  console.log("User created successfully:", user.email, user.username);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
