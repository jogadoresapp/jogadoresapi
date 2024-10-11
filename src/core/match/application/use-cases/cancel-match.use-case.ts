export interface CancelMatchUseCase {
  execute(id: string): Promise<string>;
}
