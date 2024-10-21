import {
  PlayerDominantFoot,
  PlayerPosition,
  PlayerPreferredDays,
  PlayerPreferredSchedule,
} from '../enums/player';
import { Player } from './player.entity';

describe('Player Schema', () => {
  it('deve criar uma instância de Player', () => {
    const player = new Player({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });

    expect(player).toBeInstanceOf(Player);
    expect(player.name).toBe('John Doe');
    expect(player.email).toBe('john.doe@example.com');
    expect(player.password).toBe('password123');
  });

  it('deve criar uma instância de Player usando o método estático create', () => {
    const player = Player.create({
      _id: '1',
      name: 'John Doe',
      email: 'jhon@doe.com',
      password: 'password123',
      nickname: 'John',
      position: [PlayerPosition.ATACANTE],
      dominantFoot: PlayerDominantFoot.AMBIDESTRO,
      preferredSchedule: [PlayerPreferredSchedule.MANHA],
      preferredDays: [PlayerPreferredDays.DOMINGO],
      city: 'São Paulo',
      state: 'SP',
      rating: 10,
    });

    expect(player).toBeInstanceOf(Player);
    expect(player.name).toBe('John Doe');
    expect(player.email).toBe('jhon@doe.com');
    expect(player.password).toBe('password123');
  });

  it('deve criar uma instância de Player com todas as propriedades', () => {
    const player = new Player({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });

    expect(player).toBeInstanceOf(Player);
    expect(player.name).toBe('John Doe');
    expect(player.email).toBe('john.doe@example.com');
    expect(player.password).toBe('password123');
  });
});
