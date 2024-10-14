import { SPORTS } from './sports.enum';

describe('SPORTS Enum', () => {
  it('deve ter FUSTAL como esporte', () => {
    expect(SPORTS.FUSTAL).toBe('FUSTAL');
  });

  it('deve ter FUTEBOL como esporte', () => {
    expect(SPORTS.FUTEBOL).toBe('FUTEBOL');
  });

  it('deve ter VOLEI como esporte', () => {
    expect(SPORTS.VOLEI).toBe('VOLEI');
  });

  it('deve ter BASQUETE como esporte', () => {
    expect(SPORTS.BASQUETE).toBe('BASQUETE');
  });
});
