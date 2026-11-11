import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { AuthUser, LoginCredentials } from '../../../domain/entities/auth.entity';
import { AuthRepository } from '../../../domain/repositories/auth.repository';
import { LoginUseCase } from '../../../domain/use-cases/login.use-case';
import { AuthStore } from '../../state/auth.store';
import { LoginModalComponent } from './login-modal';

describe('LoginModalComponent', () => {
  const mockUser: AuthUser = {
    id: 'user-1',
    email: 'learner@findnseekh.com',
    fullName: 'Test Learner',
    role: 'learner',
  };

  let authRepositoryMock: {
    login: ReturnType<typeof vi.fn<(credentials: LoginCredentials) => Observable<AuthUser>>>;
    getCurrentUser: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authRepositoryMock = {
      login: vi.fn((_credentials: LoginCredentials) => of(mockUser)),
      getCurrentUser: vi.fn(() => of(mockUser)),
      logout: vi.fn(() => of(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [LoginModalComponent],
      providers: [
        { provide: AuthRepository, useValue: authRepositoryMock },
        LoginUseCase,
        AuthStore,
      ],
    }).compileComponents();
  });

  it('does not render dialog when closed', () => {
    const fixture = TestBed.createComponent(LoginModalComponent);
    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders Email Address and Password inputs when open', () => {
    const fixture = TestBed.createComponent(LoginModalComponent);
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const emailInput = host.querySelector<HTMLInputElement>('#login-email');
    const passwordInput = host.querySelector<HTMLInputElement>('#login-password');

    expect(host.querySelector('[role="dialog"]')).not.toBeNull();
    expect(emailInput).not.toBeNull();
    expect(emailInput?.type).toBe('email');
    expect(passwordInput).not.toBeNull();
    expect(passwordInput?.type).toBe('password');
  });

  it('blocks invalid submit and displays validation errors', () => {
    const fixture = TestBed.createComponent(LoginModalComponent);
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const form = host.querySelector('form')!;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(authRepositoryMock.login).not.toHaveBeenCalled();
    expect(host.textContent).toContain('Email address is required.');
    expect(host.textContent).toContain('Password is required.');
  });

  it('submits valid credentials via AuthRepository.login and emits closed', () => {
    const fixture = TestBed.createComponent(LoginModalComponent);
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const closedSpy = vi.fn();
    fixture.componentInstance.closed.subscribe(closedSpy);

    const host = fixture.nativeElement as HTMLElement;
    const emailInput = host.querySelector<HTMLInputElement>('#login-email')!;
    const passwordInput = host.querySelector<HTMLInputElement>('#login-password')!;

    emailInput.value = '  learner@findnseekh.com ';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'secret123';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    host.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(authRepositoryMock.login).toHaveBeenCalledWith({
      email: 'learner@findnseekh.com',
      password: 'secret123',
    });
    expect(closedSpy).toHaveBeenCalledTimes(1);
  });

  it('shows error alert when login fails and keeps modal open', () => {
    authRepositoryMock.login.mockReturnValueOnce(throwError(() => new Error('Invalid credentials')));

    const fixture = TestBed.createComponent(LoginModalComponent);
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const closedSpy = vi.fn();
    fixture.componentInstance.closed.subscribe(closedSpy);

    const host = fixture.nativeElement as HTMLElement;
    const emailInput = host.querySelector<HTMLInputElement>('#login-email')!;
    const passwordInput = host.querySelector<HTMLInputElement>('#login-password')!;

    emailInput.value = 'learner@findnseekh.com';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'secret123';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    host.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(closedSpy).not.toHaveBeenCalled();
    expect(host.querySelector('[role="alert"]')?.textContent?.trim()).toBe('Invalid credentials');
  });
});

