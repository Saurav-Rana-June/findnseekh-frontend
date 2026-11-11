import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, Directive, ElementRef, inject, input, PLATFORM_ID } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
})
export class AutofocusDirective {
  readonly appAutofocus = input<boolean>(true);

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    afterNextRender(() => {
      if (this.isBrowser && this.appAutofocus()) {
        this.elementRef.nativeElement.focus();
      }
    });
  }
}

