import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { CustomPagination } from './custom.pagination';

describe('CustomPagination', () => {
  let fixture: ComponentFixture<CustomPagination>;
  let component: CustomPagination;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomPagination],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomPagination);
    component = fixture.componentInstance;
  });

  it('calculates totalPages and items range correctly', () => {
    fixture.componentRef.setInput('totalItems', 45);
    fixture.componentRef.setInput('pageSize', 9);
    fixture.componentRef.setInput('currentPage', 2);
    fixture.detectChanges();

    expect(component.totalPages()).toBe(5);
    expect(component.startItem()).toBe(10);
    expect(component.endItem()).toBe(18);
    expect(component.hasPrev()).toBe(true);
    expect(component.hasNext()).toBe(true);
  });

  it('renders summary info text', () => {
    fixture.componentRef.setInput('totalItems', 25);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('itemLabel', 'instructors');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Showing 1–10 of 25 instructors');
  });

  it('emits pageChange when a page number is clicked', () => {
    fixture.componentRef.setInput('totalItems', 30);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.detectChanges();

    const spy = vi.fn();
    component.pageChange.subscribe(spy);

    component.goToPage(3);
    expect(spy).toHaveBeenCalledWith(3);
  });

  it('does not emit pageChange for current page or out of range page', () => {
    fixture.componentRef.setInput('totalItems', 30);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('currentPage', 2);
    fixture.detectChanges();

    const spy = vi.fn();
    component.pageChange.subscribe(spy);

    component.goToPage(2);
    component.goToPage(0);
    component.goToPage(5);

    expect(spy).not.toHaveBeenCalled();
  });

  it('handles prevPage and nextPage navigation', () => {
    fixture.componentRef.setInput('totalItems', 30);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('currentPage', 2);
    fixture.detectChanges();

    const spy = vi.fn();
    component.pageChange.subscribe(spy);

    component.prevPage();
    expect(spy).toHaveBeenCalledWith(1);

    component.nextPage();
    expect(spy).toHaveBeenCalledWith(3);
  });

  it('generates ellipses for large page counts', () => {
    fixture.componentRef.setInput('totalItems', 100);
    fixture.componentRef.setInput('pageSize', 10); // 10 pages total
    fixture.componentRef.setInput('currentPage', 5);
    fixture.detectChanges();

    const items = component.pageItems();
    const ellipses = items.filter((i) => i.type === 'ellipsis');
    expect(ellipses.length).toBe(2);
  });
});
