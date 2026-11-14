import { TestBed } from '@angular/core/testing';
import { TeachersRepositoryImpl } from '../../data/repositories/teachers.repository.impl';
import { TeachersRepository } from '../../domain/repositories/teachers.repository';
import { GetTeachersUseCase } from '../../domain/use-cases/get-teachers.use-case';
import { TeachersStore } from './teachers.store';

describe('TeachersStore', () => {
  let store: TeachersStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TeachersRepository, useClass: TeachersRepositoryImpl },
        GetTeachersUseCase,
        TeachersStore,
      ],
    });
    store = TestBed.inject(TeachersStore);
  });

  it('loads teachers and exposes categories', () => {
    expect(store.filteredTeachers().length).toBeGreaterThan(0);
    expect(store.categories.length).toBe(9);
    expect(store.hasActiveFilters()).toBe(false);
  });

  it('filters teachers by search query', () => {
    store.setSearchQuery('Guitar');
    expect(store.filteredTeachers().some((t) => t.name === 'Rohan Mehta')).toBe(true);
    expect(store.hasActiveFilters()).toBe(true);
  });

  it('filters teachers by category', () => {
    store.setSelectedCategory('dance');
    expect(store.filteredTeachers().every((t) => t.categoryId === 'dance')).toBe(true);
  });

  it('filters teachers by location', () => {
    store.setLocationQuery('Dehradun');
    expect(store.filteredTeachers().every((t) => t.location.includes('Dehradun'))).toBe(true);
  });

  it('filters teachers by teaching mode', () => {
    store.setSelectedMode('online');
    expect(
      store.filteredTeachers().every((t) => t.teachingMode === 'online' || t.teachingMode === 'both'),
    ).toBe(true);
  });

  it('resets all filters cleanly', () => {
    store.setSearchQuery('Yoga');
    store.setLocationQuery('Chandigarh');
    store.setSelectedCategory('fitness-yoga');
    store.setSelectedMode('offline');

    expect(store.hasActiveFilters()).toBe(true);
    store.resetFilters();
    expect(store.hasActiveFilters()).toBe(false);
    expect(store.searchQuery()).toBe('');
    expect(store.locationQuery()).toBe('');
    expect(store.selectedCategory()).toBe('all');
    expect(store.selectedMode()).toBe('all');
  });

  it('initializes from query params', () => {
    store.initFromQueryParams({
      skill: 'Python',
      location: 'Saharanpur',
      category: 'technology',
      mode: 'online',
    });

    expect(store.searchQuery()).toBe('Python');
    expect(store.locationQuery()).toBe('Saharanpur');
    expect(store.selectedCategory()).toBe('technology');
    expect(store.selectedMode()).toBe('online');
  });
});

