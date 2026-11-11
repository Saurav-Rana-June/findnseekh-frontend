import { TestBed } from '@angular/core/testing';
import { HomeRepositoryImpl } from '../../data/repositories/home.repository.impl';
import { HomeRepository } from '../../domain/repositories/home.repository';
import { GetHomeOverviewUseCase } from '../../domain/use-cases/get-home-overview.use-case';
import { HomeStore } from './home.store';

describe('HomeStore', () => {
  let store: HomeStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HomeRepository, useClass: HomeRepositoryImpl },
        GetHomeOverviewUseCase,
        HomeStore,
      ],
    });
    store = TestBed.inject(HomeStore);
  });

  it('loads categories, featured teachers, steps, and combobox options', () => {
    expect(store.categories().length).toBe(8);
    expect(store.featuredTeachers().length).toBe(6);
    expect(store.steps().length).toBe(3);
    expect(store.locationOptions().length).toBe(14);
    expect(store.skillOptions().length).toBe(31);
  });

  it('filters featured teachers by skill and location', () => {
    store.updateSearch({ location: 'Delhi', skill: 'Guitar' });
    expect(store.featuredTeachers().map((t) => t.name)).toEqual(['Rohan Mehta']);

    store.clearSearch();
    expect(store.featuredTeachers().length).toBe(6);
  });
});

