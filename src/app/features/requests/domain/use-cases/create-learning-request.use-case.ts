import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LearningRequest } from '../entities/learning-request.entity';
import {
  CreateLearningRequestInput,
  RequestsRepository,
} from '../repositories/requests.repository';

@Injectable()
export class CreateLearningRequestUseCase {
  private readonly repository = inject(RequestsRepository);

  execute(input: CreateLearningRequestInput): Observable<LearningRequest> {
    return this.repository.createLearningRequest(input);
  }
}