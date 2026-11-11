import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeOverview } from '../entities/home.entity';
import { HomeRepository } from '../repositories/home.repository';

@Injectable()
export class GetHomeOverviewUseCase {
  private readonly homeRepository = inject(HomeRepository);

  execute(): Observable<HomeOverview> {
    return this.homeRepository.getOverview();
  }
}

