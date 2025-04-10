import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenService);
  });

  afterEach(() => {
    // Nettoyer le sessionStorage après chaque test
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get access token', () => {
    const mockToken = 'mock-access-token';
    service.setAccessToken(mockToken);
    const retrievedToken = service.getAccessToken();
    expect(retrievedToken).toBe(mockToken);
  });

  it('should clear access token', () => {
    service.setAccessToken('mock-token');
    service.clearAccessToken();
    const token = service.getAccessToken();
    expect(token).toBeNull();
  });

  it('should return true for valid token with future expiration', () => {
    const mockToken = createMockJWT({ exp: Math.floor(Date.now() / 1000) + 3600 }); // Expire dans 1 heure
    service.setAccessToken(mockToken);

    const isValid = service.isAccessTokenValid();
    expect(isValid).toBeTrue();
  });

  it('should return false for expired token', () => {
    const mockToken = createMockJWT({ exp: Math.floor(Date.now() / 1000) - 3600 }); // Expiré depuis 1 heure
    service.setAccessToken(mockToken);

    const isValid = service.isAccessTokenValid();
    expect(isValid).toBeFalse();
  });

  it('should decode a valid token', () => {
    const payload = { sub: '12345', name: 'Test User', exp: Math.floor(Date.now() / 1000) + 3600 };
    const mockToken = createMockJWT(payload);

    const decoded = service.decodeToken(mockToken);
    expect(decoded).toEqual(payload);
  });

  it('should return null for invalid token decoding', () => {
    const invalidToken = 'invalid-token';
    const decoded = service.decodeToken(invalidToken);
    expect(decoded).toBeNull();
  });

  it('should get token expiration date', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600; // Expire dans 1 heure
    const mockToken = createMockJWT({ exp });

    const expirationDate = (service as any).getTokenExpirationDate(mockToken); // Accès à la méthode privée
    expect(expirationDate).toBeTruthy();
    expect(expirationDate!.getTime()).toBeGreaterThan(Date.now());
  });

  it('should return null for token without expiration date', () => {
    const mockToken = createMockJWT({}); // Aucun champ `exp`
    const expirationDate = (service as any).getTokenExpirationDate(mockToken);
    expect(expirationDate).toBeNull();
  });

  it('should return false for no token in hasValidToken', () => {
    const isValid = service.isAccessTokenValid();
    expect(isValid).toBeFalse();
  });
});

/**
 * Helper function to create a mock JWT
 */
function createMockJWT(payload: object): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  return `${encodedHeader}.${encodedPayload}.signature`;
}
