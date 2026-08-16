import { prisma } from '../src/config/prisma';
import { sendPasswordResetEmail } from '../src/services/email.service';
import { forgotPassword } from '../src/controllers/auth.controller';
import dotenv from 'dotenv';
import path from 'path';

// Load env variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function main() {
  console.log('--- Testing Forgot Password & Resend Mail API locally ---');
  
  // 1. Check all users in local/dev database
  const users = await prisma.user.findMany({
    take: 5,
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true
    }
  });
  
  console.log('Current users in DB:', users);
  
  if (users.length === 0) {
    console.log('No users found in database. Let\'s create a test user first.');
    const testUser = await prisma.user.create({
      data: {
        email: 'testuser_forgot@example.com',
        username: 'testuser_forgot',
        passwordHash: '$2a$10$UnV6y3N7o99lM8fQvY56e.dM3vQYx91tGvqZg3Z2v5u5z5u5u5u5u', // dummy hash
        displayName: 'Test Forgotten'
      }
    });
    console.log('Created test user:', testUser);
    users.push(testUser);
  }

  // 2. Select the first user to test forgot password mail
  const targetUser = users[0];
  console.log(`\nTriggering password reset email for: ${targetUser.email} (${targetUser.displayName})`);
  
  try {
    const token = 'test-token-123456';
    console.log('Calling sendPasswordResetEmail...');
    await sendPasswordResetEmail(targetUser.email, token, targetUser.displayName || targetUser.username);
    console.log('Successfully sent reset password email via Resend!');
  } catch (error: any) {
    console.error('Error sending reset email:', error);
  }
}

main()
  .catch(e => {
    console.error('Execution failed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
