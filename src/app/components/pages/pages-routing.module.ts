
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { CartReconciliationComponent } from './cart-reconciliation/cart-reconciliation.component'
import { CheckoutComponent } from './checkout/checkout.component';
import { PlaceOrderComponent } from './checkout/place-order/place-order.component';
import { OrderCompleteComponent } from './order-complete/order-complete.component'
import { ContactComponent } from './contact/contact.component';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { AboutUsComponent } from './about-us/about-us.component';
// import { FaqComponent } from './faq/faq.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { WebsiteTermsComponent } from './website-terms/website-terms.component'

import { AuthGuardWithForcedLogin } from '../auth/core/auth-guard-with-forced-login.service';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'about', component: AboutUsComponent },
      { path: 'cart', component: CartComponent },
      { path: 'cart-reconciliation', component: CartReconciliationComponent },
      { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuardWithForcedLogin]},
      { path: 'place-order', component: PlaceOrderComponent, canActivate: [AuthGuardWithForcedLogin]},
      { path: 'order-complete/:id/:email', component: OrderCompleteComponent, canActivate: [AuthGuardWithForcedLogin]},
      // { path: 'faq', component: FaqComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'account-details', component: AccountDetailsComponent, canActivate: [AuthGuardWithForcedLogin] },
      { path: 'error', component: ErrorPageComponent },
      { path: 'privacy', component: PrivacyComponent },
      { path: 'website-terms', component: WebsiteTermsComponent },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
