// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
  production: false,
  CANONICAL_URL: 'http://localhost:4200',
  ENABLE_SPA_ROUTING: true,
  EXTERNAL_GRAPHQL_URL: 'http://localhost:3000/graphql-beta',
  INTERNAL_GRAPHQL_URL: 'http://reaction.api.reaction.localhost:3000/graphql-beta',
  OAUTH2_ADMIN_PORT: 4445,
  OAUTH2_AUTH_URL: 'http://localhost:4444/oauth2/auth',
  OAUTH2_ISSUER: 'http://localhost:4444',
  OAUTH2_CLIENT_ID: 'vortus-store',
  OAUTH2_CLIENT_SECRET: 'CHANGEME',
  OAUTH2_HOST: 'hydra.auth.reaction.localhost',
  OAUTH2_IDP_HOST_URL: 'http://reaction.api.reaction.localhost:3000/',
  OAUTH2_REDIRECT_URL:' http://localhost:4000/callback',
  OAUTH2_TOKEN_URL: 'http://localhost:4444/oauth2/token',
  PORT: 4000,
  SEGMENT_ANALYTICS_SKIP_MINIMIZE: true,
  SEGMENT_ANALYTICS_WRITE_KEY: 'ENTER_KEY_HERE',
  SESSION_MAX_AGE_MS: 2592000000,
  SESSION_SECRET: 'CHANGEME',
  STRIPE_PUBLIC_API_KEY: 'ENTER_STRIPE_PUBLIC_KEY_HERE',
  PRIMARY_SHOP_ID: 'cmVhY3Rpb24vc2hvcDpkOGo5anZxTXJCVFE5R3lXVA==',
  CURRENCY: 'USD'


};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
