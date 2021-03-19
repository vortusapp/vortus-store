import { environment } from '../environments/environment'
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, concat } from 'apollo-link';
import { OAuthService } from 'angular-oauth2-oidc'
import { setContext } from 'apollo-link-context';
import { HttpHeaders } from '@angular/common/http'


const uri = environment.EXTERNAL_GRAPHQL_URL;

export function provideApollo(httpLink: HttpLink, oAuthService: OAuthService) {

  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8'
    }
  }));

  const http = httpLink.create({ uri })

  // Get the authentication token from local storage if it exists
  const auth = setContext((_, { headers }) => {
          const token = sessionStorage.getItem('access_token');
          return token ? { headers: {Authorization: `Bearer ${token}`}} : {};

  });
  const noAuth = setContext((operation, context) => (
    {
        headers: {}

}));


  const cache = new InMemoryCache();

  return {
    link: auth.concat(http),
    cache
  }


}
@NgModule({
  imports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ],
  providers: [{
    provide: APOLLO_OPTIONS,
    useFactory: provideApollo,
    deps: [HttpLink]
  }],
})

export class GraphQLModule {}
