import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/httpError';
import { LoginDTO, RegisterDTO } from './auth.dto';

function signToken(userId: string) {
  const secret = process.env.JWT_SECRET as string;
  return jwt.sign({ sub: userId }, secret, { expiresIn: '7d' });
}

export const authService = {
  async register(data: RegisterDTO) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new HttpError(409, 'Já existe um usuário com este e-mail');
    }

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { email: data.email, password: hashed },
    });

    const token = signToken(user.id);
    return { token, user: { id: user.id, email: user.email } };
  },

  async login(data: LoginDTO) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      throw new HttpError(401, 'Credenciais inválidas');
    }

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      throw new HttpError(401, 'Credenciais inválidas');
    }

    const token = signToken(user.id);
    return { token, user: { id: user.id, email: user.email } };
  },
};
