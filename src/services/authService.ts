class AuthService {
  accessTokenKey: string;
  refreshTokenKey: string;

  constructor() {
    this.accessTokenKey = "accessToken";
    this.refreshTokenKey = "refreshToken";
  }

  setAccessToken(token: string) {
    localStorage.setItem(this.accessTokenKey, token);
  }

  getAccessToken() {
    return localStorage.getItem(this.accessTokenKey);
  }

  clearAccessToken() {
    localStorage.removeItem(this.accessTokenKey);
  }

  setRefreshToken(token: string) {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey);
  }

  clearRefreshToken() {
    localStorage.removeItem(this.refreshTokenKey);
  }

  clearTokens() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  isAuthenticated() {
    return this.getAccessToken() !== null;
  }
}
export default new AuthService();
