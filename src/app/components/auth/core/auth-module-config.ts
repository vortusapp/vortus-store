import { OAuthModuleConfig } from 'angular-oauth2-oidc';

export const authModuleConfig: OAuthModuleConfig = {
  resourceServer: {
    allowedUrls: ['http://127.0.0.1:4100', 'http://localhost:4100', 'http://localhost:4444'],
    sendAccessToken: true,
  }
};
