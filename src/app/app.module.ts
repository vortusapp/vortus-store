import { NgModule, APP_INITIALIZER, Component } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxImgZoomModule } from 'ngx-img-zoom';

import { MainComponent } from './components/main/main.component';

import { CartService } from './components/shared/services/cart.service';
import { CheckoutService } from './components/shared/services/checkout.service'
import { GQLService } from './components/shared/services/graphql.service'

import { AppRoutingModule } from './app-routing.module';
import { ShopModule } from './components/shop/shop.module';
import { SharedModule } from './components/shared/shared.module';
import { GraphQLModule } from './graphql.module';
import { CookieService } from 'ngx-cookie-service';

import { CoreModule } from './components/auth/core/core.module';
import { ShouldLoginComponent } from './components/auth/should-login.component'




@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ShouldLoginComponent
  ],
  imports: [
    NgxSpinnerModule,
    BrowserModule,
    SharedModule,
    ShopModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxImgZoomModule,
    GraphQLModule,
    CoreModule.forRoot(),

  ],
  providers: [
    CookieService,
    // ProductService,
    CartService,
    GQLService,
    CheckoutService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
