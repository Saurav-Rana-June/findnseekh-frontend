import { Observable } from 'rxjs';
import { AuthUser, LoginCredentials } from '../entities/auth.entity';

export abstract class AuthRepository {
  abstract login(credentials: LoginCredentials): Observable<AuthUser>;
  abstract getCurrentUser(): Observable<AuthUser>;
  abstract logout(): Observable<void>;
}

