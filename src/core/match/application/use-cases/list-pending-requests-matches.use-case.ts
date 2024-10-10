export interface ListPendingRequestsMatchesUseCase {
  execute(matchId: string): Promise<string[]>;
}
