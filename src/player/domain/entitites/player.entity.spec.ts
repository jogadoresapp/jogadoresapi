import { Player } from './player.entity';

describe('Player Entity', () => {
  it('deve criar uma instância de PLAYER', () => {
    const player = new Player(
      'John Doe',
      'john.doe@example.com',
      'password123',
    );
    expect(player).toBeInstanceOf(Player);
    expect(player.name).toBe('John Doe');
    expect(player.email).toBe('john.doe@example.com');
    expect(player.password).toBe('password123');
  });

  it('deve criar uma instância de jogador usando o método estático create', () => {
    const player = Player.create(
      'Jane Doe',
      'jane.doe@example.com',
      'password456',
    );
    expect(player).toBeInstanceOf(Player);
    expect(player.name).toBe('Jane Doe');
    expect(player.email).toBe('jane.doe@example.com');
    expect(player.password).toBe('password456');
  });

  it('should have a unique email', () => {
    const player1 = new Player(
      'John Doe',
      'john.doe@example.com',
      'password123',
    );
    const player2 = new Player(
      'Jane Doe',
      'john.doe@example.com',
      'password456',
    );
    expect(player1.email).toBe(player2.email);
  });

  it('should create a Player instance with all properties', () => {
    const player = new Player(
      'John Doe',
      'john.doe@example.com',
      'password123',
    );
    expect(player).toBeInstanceOf(Player);
    expect(player.id).toBeUndefined();
    expect(player.name).toBe('John Doe');
    expect(player.email).toBe('john.doe@example.com');
    expect(player.password).toBe('password123');
  });

  it('should create a Player instance with null currentMatchId if not provided', () => {
    const player = new Player(
      'Jane Doe',
      'jane.doe@example.com',
      'password456',
    );
    expect(player).toBeInstanceOf(Player);
    expect(player.id).toBeUndefined();
    expect(player.name).toBe('Jane Doe');
    expect(player.email).toBe('jane.doe@example.com');
    expect(player.password).toBe('password456');
  });
});
