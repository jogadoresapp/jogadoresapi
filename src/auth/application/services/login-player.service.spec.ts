import { Test, TestingModule } from '@nestjs/testing';
import { LoginPlayerService } from './login-player.service';
import { AuthService } from './auth.service';
import { LoginPlayerCommand } from '../commands/login-player.command';

describe('LoginPlayerService', () => {
  let service: LoginPlayerService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginPlayerService,
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LoginPlayerService>(LoginPlayerService);
    authService = module.get<AuthService>(AuthService);
  });

  it('deve estar definido service', () => {
    expect(service).toBeDefined();
  });

  it('deve chamar AuthService.login com os parâmetros corretos', async () => {
    const command = new LoginPlayerCommand();
    command.email = 'teste@gmail.com';
    command.password = '123456';
    const accessToken = 'someAccessToken';
    jest.spyOn(authService, 'login').mockResolvedValue({ accessToken });

    const result = await service.execute(command);

    expect(authService.login).toHaveBeenCalledWith(
      command.email,
      command.password,
    );
    expect(result).toEqual({ accessToken });
  });
});
