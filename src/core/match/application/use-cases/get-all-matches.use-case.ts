import { STATUS_MATCH } from '../../../common/enums/status-match.enum';
import { Match } from '../../domain/entities/match.entity';

export interface GetAllMatchesUseCase {
  execute(status: STATUS_MATCH): Promise<Match[]>;
}
