import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LearningRequest } from '../entities/learning-request.entity';
import { RequestsRepository } from '../repositories/requests.repository';

@Injectable()
export class GetSentRequestsUseCase {
  private readonly repo = inject(RequestsRepository);

  execute(): Observable<readonly LearningRequest[]> {
    return this.repo.getSentRequests();
  }
}

