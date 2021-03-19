import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { Address } from "../../../modals/checkout.model";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.sass']
})
export class CheckoutComponent implements OnInit {
  initialAddress
  shippingAddressBook: Address[] = []
  billingAddressBook: Address[] = []
  shippingAddressBookObservable = new BehaviorSubject<any>(null)
  billingAddressBookObservable = new BehaviorSubject<any>(null)

  constructor() { }

  ngOnInit() {
  }

  sortAddresses () {
    this.shippingAddressBook = []
     this.billingAddressBook = []
     // if(this.viewer) {

     for (let address of this.initialAddress) {
         const filteredAddress: Address = address
       if (filteredAddress.metafields){
             for (let metafield of filteredAddress.metafields) {
         if (metafield.key === 'shipping'){
           this.shippingAddressBook.push(filteredAddress)
       }
       if (metafield.key === 'billing'){
         this.billingAddressBook.push(filteredAddress)
     }


       // }
       }

     }
     console.log(this.shippingAddressBook)
     console.log(this.billingAddressBook)

     this.shippingAddressBookObservable.next(this.shippingAddressBook)
     this.billingAddressBookObservable.next(this.billingAddressBook)
   };
 }

}
