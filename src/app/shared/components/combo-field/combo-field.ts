import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

export interface ComboOption {
  readonly value: string;
  readonly hint?: string;
}

let nextComboId = 0;

@Component({
  selector: 'app-combo-field',
  templateUrl: './combo-field.html',
  styleUrl: './combo-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboFieldComponent {
  readonly fieldId = input.required<string>();
  readonly label = input.required<string>();
  readonly icon = input<'location' | 'skill'>('location');
  readonly placeholder = input<string>('');
  readonly value = input<string>('');
  readonly options = input<readonly ComboOption[]>([]);
  readonly maxOptions = input<number>(6);
  readonly freeTextPrefix = input<string>('Search for');
  readonly autoComplete = input<string>('off');

  readonly valueChange = output<string>();
  readonly optionSelected = output<ComboOption>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly listId = `${++nextComboId}-combo-list`;
  protected readonly isOpen = signal(false);
  protected readonly activeIndex = signal(-1);

  protected readonly trimmedQuery = computed(() => this.value().trim());

  protected readonly suggestions = computed(() => {
    const q = this.trimmedQuery().toLowerCase();
    const all = this.options();
    const filtered = q
      ? all.filter(
          (o) =>
            o.value.toLowerCase().includes(q) ||
            (o.hint ? o.hint.toLowerCase().includes(q) : false),
        )
      : all;
    return filtered.slice(0, this.maxOptions());
  });

  protected readonly showList = computed(
    () => this.isOpen() && (this.suggestions().length > 0 || this.trimmedQuery().length > 0),
  );

  protected optionId(index: number): string {
    return `${this.listId}-opt-${index}`;
  }

  protected openList(): void {
    this.isOpen.set(true);
  }

  protected onInput(raw: string): void {
    this.valueChange.emit(raw);
    this.isOpen.set(true);
    this.activeIndex.set(-1);
  }

  protected choose(option: ComboOption): void {
    this.valueChange.emit(option.value);
    this.optionSelected.emit(option);
    this.isOpen.set(false);
    this.activeIndex.set(-1);
  }

  protected onFocusOut(event: FocusEvent): void {
    const related = event.relatedTarget as Node | null;
    if (!this.host.nativeElement.contains(related)) {
      this.isOpen.set(false);
      this.activeIndex.set(-1);
    }
  }

  protected onOptionMouseDown(event: MouseEvent): void {
    event.preventDefault();
  }

  protected onKeyDown(event: KeyboardEvent): void {
    const items = this.suggestions();
    const open = this.isOpen();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) {
          this.isOpen.set(true);
        } else if (items.length > 0) {
          this.activeIndex.update((i) => (i + 1) % items.length);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) {
          this.isOpen.set(true);
        } else if (items.length > 0) {
          this.activeIndex.update((i) => (i <= 0 ? items.length - 1 : i - 1));
        }
        break;
      case 'Enter': {
        const idx = this.activeIndex();
        if (this.showList() && idx >= 0 && items[idx]) {
          event.preventDefault();
          this.choose(items[idx]);
        } else {
          this.isOpen.set(false);
        }
        break;
      }
      case 'Escape':
        if (open) {
          event.preventDefault();
          event.stopPropagation();
          this.isOpen.set(false);
          this.activeIndex.set(-1);
        }
        break;
      case 'Tab':
        this.isOpen.set(false);
        break;
    }
  }
}

