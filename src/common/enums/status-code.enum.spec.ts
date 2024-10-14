import { STATUS_CODES } from './status-code.enum';

describe('STATUS_CODES Enum', () => {
  it('deve ter um código de status para OK', () => {
    expect(STATUS_CODES.OK).toBe(200);
  });

  it('deve ter um código de status para CREATED', () => {
    expect(STATUS_CODES.CREATED).toBe(201);
  });

  it('deve ter um código de status para NO_CONTENT', () => {
    expect(STATUS_CODES.NO_CONTENT).toBe(204);
  });

  it('deve ter um código de status para BAD_REQUEST', () => {
    expect(STATUS_CODES.BAD_REQUEST).toBe(400);
  });

  it('deve ter um código de status para NOT_FOUND', () => {
    expect(STATUS_CODES.NOT_FOUND).toBe(404);
  });

  it('deve ter um código de status para INTERNAL_SERVER_ERROR', () => {
    expect(STATUS_CODES.INTERNAL_SERVER_ERROR).toBe(500);
  });
});
