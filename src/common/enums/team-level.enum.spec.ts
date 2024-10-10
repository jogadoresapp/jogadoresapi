import { TEAM_LEVEL } from './team-level.enum';

describe('TEAM_LEVEL Enum', () => {
  it('should have INICIANTE value', () => {
    expect(TEAM_LEVEL.INICIANTE).toBe('INICIANTE');
  });

  it('should have NORMAL value', () => {
    expect(TEAM_LEVEL.NORMAL).toBe('NORMAL');
  });

  it('should have AVANCADO value', () => {
    expect(TEAM_LEVEL.AVANCADO).toBe('AVANCADO');
  });

  it('should have all enum values defined', () => {
    const enumValues = Object.values(TEAM_LEVEL);
    expect(enumValues).toContain('INICIANTE');
    expect(enumValues).toContain('NORMAL');
    expect(enumValues).toContain('AVANCADO');
  });
});
