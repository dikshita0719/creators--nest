import type { NextFunction, Request, Response } from 'express';

const mutationMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export function allowedOrigins() {
  return (process.env.CORS_ORIGINS ?? process.env.CORS_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function isAllowedOrigin(origin: string) {
  return allowedOrigins().includes(origin);
}

export function csrfOriginMiddleware(request: Request, response: Response, next: NextFunction) {
  const origin = request.headers.origin;
  if (origin && !isAllowedOrigin(origin) && mutationMethods.has(request.method)) {
    response.status(403).json({ message: 'Invalid request origin' });
    return;
  }
  next();
}