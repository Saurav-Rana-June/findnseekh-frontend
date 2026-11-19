import { Observable } from 'rxjs';
import {
  CreateListingInput,
  TeachingListing,
  TeachingListingStatus,
  UpdateListingInput,
} from '../entities/teaching-listing.entity';

export abstract class ListingsRepository {
  abstract getMyListings(): Observable<readonly TeachingListing[]>;
  abstract createListing(input: CreateListingInput): Observable<TeachingListing>;
  abstract updateListing(id: number, input: UpdateListingInput): Observable<TeachingListing>;
  abstract updateListingStatus(
    id: number,
    status: TeachingListingStatus,
  ): Observable<TeachingListing>;
  abstract deleteListing(id: number): Observable<TeachingListing>;
}
