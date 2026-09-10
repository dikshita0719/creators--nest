import { csrfOriginMiddleware } from '../src/auth/csrf-origin.middleware';

describe('csrfOriginMiddleware', () => {
  beforeEach(() => {
    process.env.CORS_ORIGIN = 'https://app.example.com';
  });

  it('rejects state-changing requests from another origin', () => {
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    csrfOriginMiddleware({ method: 'POST', headers: { origin: 'https://evil.example' } } as never, response as never, next);

    expect(response.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('allows the configured web origin and non-browser requests', () => {
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    csrfOriginMiddleware({ method: 'POST', headers: { origin: 'https://app.example.com' } } as never, response as never, next);
    csrfOriginMiddleware({ method: 'POST', headers: {} } as never, response as never, next);

    expect(next).toHaveBeenCalledTimes(2);
    expect(response.status).not.toHaveBeenCalled();
  });
});