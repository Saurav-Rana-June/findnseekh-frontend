import { Observable } from 'rxjs';
import { HomeOverview } from '../entities/home.entity';

export abstract class HomeRepository {
  abstract getOverview(): Observable<HomeOverview>;
}

