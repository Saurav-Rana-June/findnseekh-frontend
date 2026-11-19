import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateListingInput,
  TeachingListing,
} from '../entities/teaching-listing.entity';
import { ListingsRepository } from '../repositories/listings.repository';

@Injectable()
export class CreateListingUseCase {
  private readonly repository = inject(ListingsRepository);

  execute(input: CreateListingInput): Observable<TeachingListing> {
    return this.repository.createListing(input);
  }
}
