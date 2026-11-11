import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomTextField } from './custom.textfield';

@Component({
  imports: [ReactiveFormsModule, CustomTextField],
  template: `
    <app-custom-textfield
      fieldId="test-email"
      label="Email Address"
      type="email"
      placeholder="you@example.com"
      leadingIcon="mail"
      [formControl]="control"
      [invalid]="control.invalid && control.touched"
      [errorMessage]="control.touched && control.hasError('required') ? 'Required field' : ''"
    />
  `,
})
class TestHostComponent {
  readonly control = new FormControl('', { nonNullable: true, validators: [Validators.required] });
}

describe('CustomTextField', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomTextField, TestHostComponent],
    }).compileComponents();
  });

  it('works with ReactiveFormsModule ControlValueAccessor and error display', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const input = host.querySelector<HTMLInputElement>('#test-email')!;
    expect(input).not.toBeNull();
    expect(input.type).toBe('email');

    input.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();
    expect(host.textContent).toContain('Required field');

    input.value = 'alice@findnseekh.com';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.control.value).toBe('alice@findnseekh.com');
  });

  it('applies dynamic CSS custom properties', () => {
    const fixture = TestBed.createComponent(CustomTextField);
    fixture.componentRef.setInput('label', 'Name');
    fixture.componentRef.setInput('borderRadius', '12px');
    fixture.componentRef.setInput('focusBorderColor', '#174e38');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.style.getPropertyValue('--cp-tf-radius')).toBe('12px');
    expect(host.style.getPropertyValue('--cp-tf-focus-border')).toBe('#174e38');
  });
});

