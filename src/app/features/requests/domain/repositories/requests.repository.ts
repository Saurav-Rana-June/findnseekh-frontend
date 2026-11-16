import { Observable } from 'rxjs';
import { LearningRequest } from '../entities/learning-request.entity';

export abstract class RequestsRepository {
  abstract getSentRequests(): Observable<readonly LearningRequest[]>;
  abstract getReceivedRequests(): Observable<readonly LearningRequest[]>;
  abstract getRequestById(id: number): Observable<LearningRequest | null>;
  abstract acceptRequest(id: number): Observable<LearningRequest>;
  abstract rejectRequest(id: number): Observable<LearningRequest>;
  abstract cancelRequest(id: number): Observable<LearningRequest>;
}

