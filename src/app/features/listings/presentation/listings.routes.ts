import { Routes } from '@angular/router';
import { APP_ROUTE_PATHS } from '../../../core/constants/app.constants';
import { ListingsRepositoryImpl } from '../data/repositories/listings.repository.impl';
import { ListingsApiService } from '../data/services/listings-api.service';
import { ListingsRepository } from '../domain/repositories/listings.repository';
import { CreateListingUseCase } from '../domain/use-cases/create-listing.use-case';
import { DeleteListingUseCase } from '../domain/use-cases/delete-listing.use-case';
import { GetMyListingsUseCase } from '../domain/use-cases/get-my-listings.use-case';
import { UpdateListingStatusUseCase } from '../domain/use-cases/update-listing-status.use-case';
import { UpdateListingUseCase } from '../domain/use-cases/update-listing.use-case';
import { ListingFormPage } from './pages/listing-form-page/listing-form-page';
import { ListingsPage } from './pages/listings-page/listings-page';
import { ListingsStore } from './state/listings.store';

export const LISTINGS_ROUTES: Routes = [
  {
    path: '',
    providers: [
      ListingsApiService,
      { provide: ListingsRepository, useClass: ListingsRepositoryImpl },
      GetMyListingsUseCase,
      CreateListingUseCase,
      UpdateListingUseCase,
      UpdateListingStatusUseCase,
      DeleteListingUseCase,
      ListingsStore,
    ],
    children: [
      {
        path: '',
        component: ListingsPage,
        title: 'My Teaching Listings — FindnSeekh',
      },
      {
        path: APP_ROUTE_PATHS.listingsNew,
        component: ListingFormPage,
        title: 'Create Teaching Listing — FindnSeekh',
      },
      {
        path: APP_ROUTE_PATHS.listingsEdit,
        component: ListingFormPage,
        title: 'Edit Teaching Listing — FindnSeekh',
      },
    ],
  },
];
