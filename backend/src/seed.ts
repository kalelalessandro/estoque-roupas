import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from './lib/prisma';

async function main() {
  const email = 'admin@loja.com';
  const password = '123456';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Usuário admin já existe.');
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { email, password: hashed } });

  console.log('Usuário criado:');
  console.log(`  email: ${email}`);
  console.log(`  senha: ${password}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
