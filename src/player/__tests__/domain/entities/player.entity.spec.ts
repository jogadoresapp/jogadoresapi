import { Player } from '../../../domain/entitites/player.entity';

describe('Player Entity', () => {
  describe('constructor', () => {
    it('should create a player with the given name, email, password, and currentMatchId', () => {
      const name = 'John Doe';
      const email = 'john.doe@example.com';
      const password = 'password123';
      const currentMatchId = 'match-123';

      const player = new Player(name, email, password, currentMatchId);

      expect(player.name).toBe(name);
      expect(player.email).toBe(email);
      expect(player.password).toBe(password);
      expect(player.currentMatchId).toBe(currentMatchId);
    });

    it('should create a player with null currentMatchId if not provided', () => {
      const name = 'Jane Doe';
      const email = 'jane.doe@example.com';
      const password = 'password456';

      const player = new Player(name, email, password, null);

      expect(player.name).toBe(name);
      expect(player.email).toBe(email);
      expect(player.password).toBe(password);
      expect(player.currentMatchId).toBeNull();
    });
  });
});
