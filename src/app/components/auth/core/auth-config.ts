import { environment } from './../../../../environments/environment.prod';
import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'http://localhost:4444/',
  clientId: 'example-storefront', // The "Auth Code + PKCE" client
  responseType: 'code',
  redirectUri: window.location.origin + '/index.html',
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  scope: 'offline_access offline openid', // Ask offline_access to support refresh token refreshes
  useSilentRefresh: true, // Needed for Code Flow to suggest using iframe-based refreshes
  silentRefreshTimeout: 5000, // For faster testing
  timeoutFactor: 0.25, // For faster testing
  sessionChecksEnabled: true,
  showDebugInformation: true, // Also requires enabling "Verbose" level in devtools
  clearHashAfterLogin: false, // https://github.com/manfredsteyer/angular-oauth2-oidc/issues/457#issuecomment-431807040,
  nonceStateSeparator : 'semicolon', // Real semicolon gets mangled by IdentityServer's URI encoding,
  requireHttps: false,
  oidc: true,
  tokenEndpoint: "http://localhost:4444/oauth2/token",
  userinfoEndpoint: 'http://localhost:4444/userinfo'

};
