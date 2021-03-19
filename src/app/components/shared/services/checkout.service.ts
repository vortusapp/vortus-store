import { ProductService } from 'src/app/components/shared/services/product.service';
import { AuthService } from './../../../components/auth/core/auth.service';import  gql  from 'graphql-tag';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from "@angular/router"
import { GQLService } from './graphql.service';
import { environment } from '../../../../environments/environment'
import { Address, PaymentMethods } from 'src/app/modals/checkout.model';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})



export class CheckoutService {
  isLoggedIn: boolean;
constructor(
  private cartService: CartService,
  private authService: AuthService,
  private apollo: Apollo,
  private router: Router,
  private gqlService: GQLService) {
    this.authService.isAuthenticated$.subscribe(res => {
      this.isLoggedIn = res
      // this.viewCart()
    })
      // this.getCart()
      // this.getItems()
      // this.findPaymentMethods()
    }

    ngOnInit() {
    }

public paymentMethods = new BehaviorSubject<PaymentMethods[]>(null)

public cartItems = new BehaviorSubject<any>(null)
private deletedAddress = new BehaviorSubject<any>(null)
private savedAddress = new BehaviorSubject<any>(null)

public getItems(): Observable<any> {
  this.viewCart()
  return this.cartItems
}

public viewCart() {
  if (this.authService.accountId) {
    this.apollo.query({
        variables: {
          'accountId': this.authService.accountId,
          'shopId': environment.PRIMARY_SHOP_ID
        },
        query: this.gqlService.viewAccountCart,
        errorPolicy: "all"
    })
    .subscribe((res: {data}) => {
      if (res.data.cart) {
        this.cartService.accountCartId = res.data.cart._id;
      this.updateFulfillmentMethod(res.data.cart.checkout.fulfillmentGroups[0]._id)
    }
      this.cartItems.next(res)


    })
  }

}



public setEmail(email){
  this.apollo.mutate({
      errorPolicy: "all",
    variables: {
      input:{
        "cartId": this.cartService.cartId,
        "email": email
      }
    },
    mutation: this.gqlService.addEmailToCart,
    // refetchQueries: [{
    //   variables: {
    //     'accountId': this.authService.accountId,
    //   'shopId': environment.PRIMARY_SHOP_ID
    //   },
    //   query: this.gqlService.viewAccountCart
    // }]
  }).subscribe((res: {data}) => {
    this.updateFulfillmentMethod(res.data.setEmailOnAnonymousCart.cart.checkout.fulfillmentGroups[0]._id)
    // this.router.navigate(['pages/place-order'])

  })
}

public deleteAddress(addressId): Observable<any> {
  this.deleteAddressMutation(addressId)
  return this.deletedAddress
}

public deleteAddressMutation(addressId) {
  this.apollo.mutate({
    variables: {
      "input": {
      "accountId": this.authService.accountId,
      "addressId": addressId

      }},
      mutation: this.gqlService.removeAccountAddressBookEntry,

      errorPolicy: "all"

  }).subscribe((res) => {
    this.deletedAddress.next(res)
  }
    )
}
public setAddress(address: Address){



  if (!this.cartService.accountCartId) {
    console.log(this.cartService.accountCartId)
    this.cartService.getItems().subscribe(() => {
      this.mutateSetAddress(address)
    })
  }
  else {
    this.mutateSetAddress(address)
  }
}

private mutateSetAddress (address: Address){
  this.apollo.mutate({
    variables: {
      "input": {
      "address": address,
      "cartId": this.cartService.accountCartId

      }},
      mutation: this.gqlService.addAddressToCart,
      // refetchQueries: [{
      //   variables: {
      //     'accountId': this.authService.accountId,
      //     'shopId': environment.PRIMARY_SHOP_ID
      //   },
      //   query: this.gqlService.viewAccountCart
      // }],
      errorPolicy: "all"

  }).subscribe((res: {data}) => {
    console.log(res)
    this.updateFulfillmentMethod(res.data.setShippingAddressOnCart.cart.checkout.fulfillmentGroups[0]._id)
    // this.setEmail(email)
    // this.router.navigate(['pages/place-order'])
  }
    )
}

public addToAddressBook(address: Address) {
  console.log(address)
  this.apollo.mutate({
    variables: {
      input: {
        'accountId': this.authService.accountId,
        'address': address
      }
    },
    mutation: this.gqlService.addToAddressBook,
    refetchQueries: [{
      query: this.gqlService.viewer
    }],
    errorPolicy: "all"
  }).subscribe((res) => {console.log(res)})
}

public saveBillingAddress(billingAddress?): Observable<any>{
  if (billingAddress) {
    console.log(billingAddress)
    this.savedAddress.next(billingAddress)
  }

  return this.savedAddress
}

  public updateFulfillmentMethod(groupId){
    this.apollo.mutate({
      errorPolicy: "all",
      variables: {
        input: {
          "cartId": this.cartService.accountCartId,
          "fulfillmentGroupId": groupId
        }
      },
      mutation: this.gqlService.updateFulfillmentOptionsForGroup,
      // refetchQueries: [{
      //   variables: {
      //     'accountId': this.authService.accountId,
      //     'shopId': environment.PRIMARY_SHOP_ID
      //   },
      //   query: this.gqlService.viewAccountCart,
      // }]
    }).subscribe(res => {
      this.cartItems.next(res)
    })
  }

  public getPaymentMethods(): Observable<PaymentMethods[]> {
    this.findPaymentMethods()
    return this.paymentMethods
  }

  public findPaymentMethods (){
  this.apollo.query({
      errorPolicy: "all",
    variables: {
      "shopId": environment.PRIMARY_SHOP_ID
    },
    query: this.gqlService.availablePaymentMethods
  }).subscribe((res: {data}) => {
    this.paymentMethods.next([...res.data.availablePaymentMethods])


  })
  }

  public placeOrder (input) {
    console.log(input)
    this.apollo.mutate({
      errorPolicy: "all",
      variables: {
        input: input
      },
      mutation: this.gqlService.placeOrder,
      // refetchQueries: [{
      //   variables: {
      //     'accountId': this.authService.accountId,
      //   'shopId': environment.PRIMARY_SHOP_ID
      //   },
      //   query: this.gqlService.viewAccountCart
      // }]
    })
    .subscribe((res: {data}) => {
      if(!res) {
        console.error('There has been an error placing your order')
      }
      let id = res.data.placeOrder.orders[0]._id
      let email = res.data.placeOrder.orders[0].email
      this.router.navigate(['pages/order-complete', id, email])
      this.cartService.emptyCart()
    })

  }

  public addressBookLookup () {

  }


}
