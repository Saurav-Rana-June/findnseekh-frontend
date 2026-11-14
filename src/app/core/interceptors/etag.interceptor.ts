import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';

interface CacheEntry {
  readonly etag: string;
  readonly response: HttpResponse<unknown>;
}

const etagCache = new Map<string, CacheEntry>();

/**
 * Client-side ETag caching interceptor.
 * Sends `If-None-Match` when an ETag is cached for a GET URL,
 * and seamlessly recovers cached responses when receiving `304 Not Modified`.
 */
export const etagInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  if (req.method !== 'GET') {
    return next(req);
  }

  const cacheKey = req.urlWithParams;
  const cached = etagCache.get(cacheKey);

  const requestToSend = cached?.etag
    ? req.clone({
        setHeaders: {
          'If-None-Match': cached.etag,
        },
      })
    : req;

  return next(requestToSend).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response && event.status === 200) {
        const etag =
          event.headers.get('etag') ||
          event.headers.get('ETag') ||
          event.headers.get('Etag');
        if (etag) {
          etagCache.set(cacheKey, { etag, response: event });
        }
      }
    }),
    catchError((error: unknown) => {
      // Handle 304 Not Modified responses by serving the cached response
      if (
        cached &&
        error instanceof HttpErrorResponse &&
        (error.status === 304 || error.status === 0)
      ) {
        return of(cached.response);
      }
      return throwError(() => error);
    }),
  );
};

