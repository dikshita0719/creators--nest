import type { NextFunction, Request, Response } from 'express';

const mutationMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export function csrfOriginMiddleware(request: Request, response: Response, next: NextFunction) {
  const origin = request.headers.origin;
  const allowedOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:3000';
  if (origin && origin !== allowedOrigin && mutationMethods.has(request.method)) {
    response.status(403).json({ message: 'Invalid request origin' });
    return;
  }
  next();
}