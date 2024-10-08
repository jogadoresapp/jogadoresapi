import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { JwtPayload } from '../../domain/jwt-payload';
import * as dotenv from 'dotenv';

dotenv.config();

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('deve estar definido a estratégia', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('deve retornar um objeto de usuário com userId e email', async () => {
      const payload: JwtPayload = { sub: '123', email: 'test@example.com' };
      const result = await jwtStrategy.validate(payload);
      expect(result).toEqual({ userId: '123', email: 'test@example.com' });
    });
  });
});
