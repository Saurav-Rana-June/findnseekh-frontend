import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, timeout } from 'rxjs';
import { API_CONFIG, PROTOTYPE_MODE } from '../config/api.config';

export type QueryParamValue = string | number | boolean | null | undefined;
export type QueryParamsInput = Record<string, QueryParamValue | readonly QueryParamValue[]>;

export interface ApiRequestOptions {
  readonly params?: QueryParamsInput;
  readonly headers?: HttpHeaders | Record<string, string | readonly string[]>;
  readonly context?: HttpContext;
  readonly withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ApiHttpService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(API_CONFIG);
  private readonly prototypeMode = inject(PROTOTYPE_MODE, { optional: true }) ?? Boolean(this.config?.prototypeMode);

  get<TResponse>(path: string, options?: ApiRequestOptions): Observable<TResponse> {
    if (this.prototypeMode) {
      return of({ data: null, message: 'Prototype Mode active' } as unknown as TResponse);
    }
    return this.http
      .get<TResponse>(this.buildUrl(path), this.buildHttpOptions(options))
      .pipe(timeout(this.config.timeoutMs));
  }

  post<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
    options?: ApiRequestOptions,
  ): Observable<TResponse> {
    if (this.prototypeMode) {
      return of({ data: null, message: 'Prototype Mode active' } as unknown as TResponse);
    }
    return this.http
      .post<TResponse>(this.buildUrl(path), body, this.buildHttpOptions(options))
      .pipe(timeout(this.config.timeoutMs));
  }

  put<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
    options?: ApiRequestOptions,
  ): Observable<TResponse> {
    if (this.prototypeMode) {
      return of({ data: null, message: 'Prototype Mode active' } as unknown as TResponse);
    }
    return this.http
      .put<TResponse>(this.buildUrl(path), body, this.buildHttpOptions(options))
      .pipe(timeout(this.config.timeoutMs));
  }

  patch<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
    options?: ApiRequestOptions,
  ): Observable<TResponse> {
    if (this.prototypeMode) {
      return of({ data: null, message: 'Prototype Mode active' } as unknown as TResponse);
    }
    return this.http
      .patch<TResponse>(this.buildUrl(path), body, this.buildHttpOptions(options))
      .pipe(timeout(this.config.timeoutMs));
  }

  delete<TResponse>(path: string, options?: ApiRequestOptions): Observable<TResponse> {
    if (this.prototypeMode) {
      return of({ data: null, message: 'Prototype Mode active' } as unknown as TResponse);
    }
    return this.http
      .delete<TResponse>(this.buildUrl(path), this.buildHttpOptions(options))
      .pipe(timeout(this.config.timeoutMs));
  }

  private buildUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    const normalizedBase = this.config.baseUrl.replace(/\/+$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${normalizedBase}${normalizedPath}`;
  }

  private buildHttpOptions(options?: ApiRequestOptions): {
    params?: HttpParams;
    headers?: HttpHeaders | Record<string, string | string[]>;
    context?: HttpContext;
    withCredentials?: boolean;
  } {
    if (!options) {
      return {};
    }

    const headers =
      options.headers instanceof HttpHeaders
        ? options.headers
        : options.headers
          ? this.toMutableHeadersRecord(options.headers)
          : undefined;

    return {
      params: options.params ? this.buildParams(options.params) : undefined,
      headers,
      context: options.context,
      withCredentials: options.withCredentials,
    };
  }

  private toMutableHeadersRecord(
    headers: Record<string, string | readonly string[]>,
  ): Record<string, string | string[]> {
    const result: Record<string, string | string[]> = {};
    for (const [key, value] of Object.entries(headers)) {
      result[key] = Array.isArray(value) ? [...value] : (value as string);
    }
    return result;
  }

  private buildParams(input: QueryParamsInput): HttpParams {
    let params = new HttpParams();

    for (const [key, rawValue] of Object.entries(input)) {
      if (rawValue === null || rawValue === undefined) {
        continue;
      }

      if (Array.isArray(rawValue)) {
        for (const item of rawValue) {
          if (item !== null && item !== undefined) {
            params = params.append(key, String(item));
          }
        }
      } else {
        params = params.set(key, String(rawValue));
      }
    }

    return params;
  }
}

