import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LearningRequest } from '../entities/learning-request.entity';
import { RequestsRepository } from '../repositories/requests.repository';

@Injectable()
export class AcceptRequestUseCase {
  private readonly repo = inject(RequestsRepository);

  execute(id: number): Observable<LearningRequest> {
    return this.repo.acceptRequest(id);
  }
}

