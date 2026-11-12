import { Observable } from 'rxjs';
import {
  AuthUser,
  LoginCredentials,
  RegisterPayload,
  TeacherProfile,
  TeacherProfileUpdatePayload,
} from '../entities/auth.entity';

export abstract class AuthRepository {
  abstract login(credentials: LoginCredentials): Observable<AuthUser>;
  abstract register(payload: RegisterPayload): Observable<AuthUser>;
  abstract getCurrentUser(): Observable<AuthUser>;
  abstract becomeTeacher(): Observable<TeacherProfile>;
  abstract updateTeacherProfile(payload: TeacherProfileUpdatePayload): Observable<TeacherProfile>;
  abstract logout(): Observable<void>;
}
