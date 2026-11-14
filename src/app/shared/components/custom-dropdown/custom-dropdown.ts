import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

export interface CustomDropdownOption<T = any> {
  readonly value: T;
  readonly label: string;
  readonly hint?: string;
}

let nextDropdownId = 0;

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.html',
  styleUrl: './custom-dropdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomDropdown<T = any> {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly options = input.required<readonly CustomDropdownOption<T>[]>();
  readonly value = input<T | null | undefined>(undefined);
  readonly placeholder = input<string>('Select...');
  readonly label = input<string>('');
  readonly ariaLabel = input<string>('');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly align = input<'left' | 'right'>('left');
  readonly minWidth = input<string>('180px');
  readonly disabled = input<boolean>(false);

  readonly valueChange = output<T>();

  protected readonly dropdownId = `dropdown-${++nextDropdownId}`;
  protected readonly listId = `${this.dropdownId}-list`;
  protected readonly isOpen = signal<boolean>(false);

  protected readonly selectedOption = computed(() => {
    const val = this.value();
    return this.options().find((opt) => opt.value === val) ?? null;
  });

  protected readonly displayLabel = computed(() => {
    return this.selectedOption()?.label ?? this.placeholder();
  });

  protected toggleOpen(): void {
    if (this.disabled()) return;
    this.isOpen.update((v) => !v);
  }

  protected selectOption(opt: CustomDropdownOption<T>): void {
    if (this.disabled()) return;
    this.valueChange.emit(opt.value);
    this.isOpen.set(false);
  }

  protected onFocusOut(event: FocusEvent): void {
    const related = event.relatedTarget as Node | null;
    if (!this.host.nativeElement.contains(related)) {
      this.isOpen.set(false);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }

  @HostListener('keydown.escape')
  onEscape(): void {
    this.isOpen.set(false);
  }
}

