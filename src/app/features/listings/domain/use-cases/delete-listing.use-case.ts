import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeachingListing } from '../entities/teaching-listing.entity';
import { ListingsRepository } from '../repositories/listings.repository';

@Injectable()
export class DeleteListingUseCase {
  private readonly repository = inject(ListingsRepository);

  execute(id: number): Observable<TeachingListing> {
    return this.repository.deleteListing(id);
  }
}
