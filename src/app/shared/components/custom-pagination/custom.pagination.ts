import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

export type PaginationItem =
  | { type: 'page'; page: number }
  | { type: 'ellipsis'; id: string };

export type PaginationVariant = 'default' | 'card' | 'inline';

@Component({
  selector: 'app-custom-pagination',
  standalone: true,
  templateUrl: './custom.pagination.html',
  styleUrl: './custom.pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomPagination {
  readonly currentPage = input<number>(1);
  readonly pageSize = input<number>(9);
  readonly totalItems = input<number>(0);
  readonly showItemCount = input<boolean>(true);
  readonly itemLabel = input<string>('teachers');
  readonly variant = input<PaginationVariant>('default');

  readonly pageChange = output<number>();

  readonly totalPages = computed(() => {
    const size = Math.max(1, this.pageSize());
    return Math.max(1, Math.ceil(this.totalItems() / size));
  });

  readonly hasPrev = computed(() => this.currentPage() > 1);
  readonly hasNext = computed(() => this.currentPage() < this.totalPages());

  readonly startItem = computed(() => {
    if (this.totalItems() === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize() + 1;
  });

  readonly endItem = computed(() => {
    return Math.min(this.totalItems(), this.currentPage() * this.pageSize());
  });

  readonly pageItems = computed<readonly PaginationItem[]>(() => {
    const total = this.totalPages();
    const current = Math.min(Math.max(1, this.currentPage()), total);

    // If total pages is 7 or fewer, show all pages
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => ({
        type: 'page' as const,
        page: i + 1,
      }));
    }

    const items: PaginationItem[] = [];

    // Always include page 1
    items.push({ type: 'page', page: 1 });

    if (current <= 4) {
      // Near start: 1, 2, 3, 4, 5, ..., total
      for (let p = 2; p <= 5; p++) {
        items.push({ type: 'page', page: p });
      }
      items.push({ type: 'ellipsis', id: 'ellipsis-end' });
      items.push({ type: 'page', page: total });
    } else if (current >= total - 3) {
      // Near end: 1, ..., total - 4, total - 3, total - 2, total - 1, total
      items.push({ type: 'ellipsis', id: 'ellipsis-start' });
      for (let p = total - 4; p <= total; p++) {
        items.push({ type: 'page', page: p });
      }
    } else {
      // In middle: 1, ..., current - 1, current, current + 1, ..., total
      items.push({ type: 'ellipsis', id: 'ellipsis-start' });
      items.push({ type: 'page', page: current - 1 });
      items.push({ type: 'page', page: current });
      items.push({ type: 'page', page: current + 1 });
      items.push({ type: 'ellipsis', id: 'ellipsis-end' });
      items.push({ type: 'page', page: total });
    }

    return items;
  });

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) {
      return;
    }
    this.pageChange.emit(page);
  }

  prevPage(): void {
    if (this.hasPrev()) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.hasNext()) {
      this.goToPage(this.currentPage() + 1);
    }
  }
}
