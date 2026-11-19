import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TeachingListing,
  UpdateListingInput,
} from '../entities/teaching-listing.entity';
import { ListingsRepository } from '../repositories/listings.repository';

@Injectable()
export class UpdateListingUseCase {
  private readonly repository = inject(ListingsRepository);

  execute(id: number, input: UpdateListingInput): Observable<TeachingListing> {
    return this.repository.updateListing(id, input);
  }
}
