import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeachingListing } from '../entities/teaching-listing.entity';
import { ListingsRepository } from '../repositories/listings.repository';

@Injectable()
export class GetMyListingsUseCase {
  private readonly repository = inject(ListingsRepository);

  execute(): Observable<readonly TeachingListing[]> {
    return this.repository.getMyListings();
  }
}
