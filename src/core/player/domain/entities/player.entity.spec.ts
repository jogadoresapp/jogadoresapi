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
      id: 'some-id',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });

    expect(player).toBeInstanceOf(Player);
    expect(player.name).toBe('John Doe');
    expect(player.email).toBe('john.doe@example.com');
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
