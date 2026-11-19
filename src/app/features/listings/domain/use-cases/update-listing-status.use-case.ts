import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TeachingListing,
  TeachingListingStatus,
} from '../entities/teaching-listing.entity';
import { ListingsRepository } from '../repositories/listings.repository';

@Injectable()
export class UpdateListingStatusUseCase {
  private readonly repository = inject(ListingsRepository);

  execute(id: number, status: TeachingListingStatus): Observable<TeachingListing> {
    return this.repository.updateListingStatus(id, status);
  }
}
