import { STATUS_MATCH } from './status-match.enum';

describe('STATUS_MATCH Enum', () => {
  it('should have a value A_REALIZAR', () => {
    expect(STATUS_MATCH.A_REALIZAR).toBe('A_REALIZAR');
  });

  it('should have a value EM_EXECUCAO', () => {
    expect(STATUS_MATCH.EM_EXECUCAO).toBe('EM_EXECUCAO');
  });

  it('should have a value REALIZADA', () => {
    expect(STATUS_MATCH.REALIZADA).toBe('REALIZADA');
  });

  it('should have a value CANCELADA', () => {
    expect(STATUS_MATCH.CANCELADA).toBe('CANCELADA');
  });
});
