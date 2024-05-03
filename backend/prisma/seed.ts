import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/util/security';

const prisma = new PrismaClient();

async function main() {
  const seed_email = process.env.SEED_EMAIL;
  const seed_password = process.env.SEED_PASSWORD;

  await prisma.user.upsert({
    where: { email: process.env.SEED_EMAIL },
    update: {},
    create: {
      email: seed_email,
      hashed_password: hashPassword(seed_password),
      first_name: 'First',
      last_name: 'User',
      is_admin: true,
    },
  });

  console.log('Seeded the database with an admin user');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
