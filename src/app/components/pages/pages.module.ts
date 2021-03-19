


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartComponent } from './cart/cart.component';
import { CartReconciliationComponent } from './cart-reconciliation/cart-reconciliation.component';
import { ContactComponent } from './contact/contact.component';
import { AddressesComponent } from './checkout/addresses/addresses.component';
import { AddressBookComponent } from './checkout/address-book/address-book.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PlaceOrderComponent } from './checkout/place-order/place-order.component'
import { OrderCompleteComponent } from './order-complete/order-complete.component'
import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountDetailsComponent } from './account-details/account-details.component';
// import { FaqComponent } from './faq/faq.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { BlogModule } from '../blog/blog.module';
import { ErrorPageComponent } from './error-page/error-page.component';
import { AgmCoreModule } from '@agm/core';
import { PrivacyComponent } from './privacy/privacy.component';
import { WebsiteTermsComponent } from './website-terms/website-terms.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    SharedModule,
    BlogModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDPM6HA96FiWhoVieMmF0T-segiya5Ytf8'
    })

  ],
  entryComponents: [
    AddressesComponent
  ],
  declarations: [
    AddressesComponent,
    AddressBookComponent,
    CartComponent,
    CartReconciliationComponent,
    ContactComponent,
    CheckoutComponent,
    PlaceOrderComponent,
    OrderCompleteComponent,
    AccountDetailsComponent,
    // FaqComponent,
    AboutUsComponent,
    ErrorPageComponent,
    PrivacyComponent,
    WebsiteTermsComponent

  ]
})
export class PagesModule { }
