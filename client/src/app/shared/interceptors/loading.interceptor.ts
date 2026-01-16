import {
  HttpEvent,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { of, tap } from 'rxjs';

const cache = new Map<string, HttpEvent<any>>();

// Patterns for cache invalidation - when these endpoints are modified, clear related caches
const cacheInvalidationPatterns: Record<string, string[]> = {
  messages: ['/messages'], // POST/DELETE to messages invalidates all message caches
  'message-thread': ['/messages/thread'], // POST to thread invalidates thread caches
};

/**
 * Invalidate cache entries that match the given patterns
 */
function invalidateCache(patterns: string[]): void {
  const keysToDelete: string[] = [];

  cache.forEach((_, key) => {
    if (patterns.some((pattern) => key.includes(pattern))) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach((key) => cache.delete(key));
}

/**
 * Determine which caches should be invalidated based on the request URL
 */
function getCacheInvalidationPatterns(url: string): string[] {
  if (url.includes('/messages')) {
    return cacheInvalidationPatterns['messages'];
  }
  return [];
}

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // For GET requests, check cache first
  if (req.method === 'GET') {
    const cachedResponse = cache.get(req.urlWithParams);
    if (cachedResponse) {
      console.log('[Cache] Returning cached response for:', req.urlWithParams);
      return of(cachedResponse);
    }
  }

  // For non-GET requests (POST, PUT, DELETE), invalidate related caches
  if (req.method !== 'GET') {
    const patternsToInvalidate = getCacheInvalidationPatterns(req.url);
    if (patternsToInvalidate.length > 0) {
      console.log('[Cache] Invalidating cache patterns:', patternsToInvalidate);
      invalidateCache(patternsToInvalidate);
    }
  }

  return next(req).pipe(
    tap((event) => {
      // Cache successful GET responses
      if (req.method === 'GET' && event instanceof HttpResponse) {
        console.log('[Cache] Caching GET response for:', req.urlWithParams);
        cache.set(req.urlWithParams, event);
      }
    })
  );
};
