export interface CancelMatchUseCase {
  execute(id: string, playerId: string): Promise<string>;
}
