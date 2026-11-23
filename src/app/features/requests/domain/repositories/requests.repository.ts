import { Observable } from 'rxjs';
import { LearningRequest } from '../entities/learning-request.entity';

export interface CreateLearningRequestInput {
  readonly skillListingId: number;
  readonly message: string;
}

export abstract class RequestsRepository {
  abstract createLearningRequest(input: CreateLearningRequestInput): Observable<LearningRequest>;

  abstract getSentRequests(): Observable<readonly LearningRequest[]>;
  abstract getReceivedRequests(): Observable<readonly LearningRequest[]>;
  abstract getRequestById(id: number): Observable<LearningRequest | null>;
  abstract acceptRequest(id: number): Observable<LearningRequest>;
  abstract rejectRequest(id: number): Observable<LearningRequest>;
  abstract cancelRequest(id: number): Observable<LearningRequest>;
}

