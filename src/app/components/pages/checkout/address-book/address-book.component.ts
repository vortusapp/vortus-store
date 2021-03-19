import { Metafields } from './../../../../modals/cart-item';
import { AddressesComponent } from "./../addresses/addresses.component";
import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { CartService } from "../../../shared/services/cart.service";
import { CheckoutService } from "../../../shared/services/checkout.service";
import { Observable, of, Subscription, BehaviorSubject } from "rxjs";
import { Address } from "../../../../modals/checkout.model";
import { ProductService } from "../../../shared/services/product.service";
import { Router } from "@angular/router";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormGroup,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: "app-address-book",
  templateUrl: "./address-book.component.html",
  styleUrls: ["./address-book.component.sass"],

})
export class AddressBookComponent implements OnInit, OnDestroy {
  public cartItems;
  // : Observable<CartItems> = of({cartItem: [], cartTotal: 0});
  public buyProducts;
  // : CartItems = {cartItem: [], cartTotal: 0}

  amount: number;
  payments: string[] = ["Create an Account?", "Flat Rate"];
  paymantWay: string[] = ["Trade Account", "Credit Card"];
  address: Address = {};

  private userAddressBook: [];
  getViewer: Subscription

  newAddress: Address = {};
  @Input() use
  shippingAddress: Address = null;
  initialAddress
  addressBook
  shippingAddressBook: Address[] = []
  billingAddressBook: Address[] = []
  matcher = new MyErrorStateMatcher();
  shippingAddressBookObservable = new BehaviorSubject<any>(null)
  billingAddressBookObservable = new BehaviorSubject<any>(null)
  viewer

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    public productService: ProductService,
    private router: Router,
    public dialog: MatDialog

  ) {}

  ngOnInit() {
    console.log(this.use)
     if (this.use === 'billing') {
  this.billingAddressBookObservable.subscribe((res) =>{
    console.log(res)
    this.addressBook = res

  })}
    if (this.use === 'shipping') {
   this.shippingAddressBookObservable.subscribe((res) =>{
    console.log(res)
    this.addressBook = res
  })

 }

 this.addressBookLookup();






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

  addressBookLookup() {
    this.getViewer = this.productService.viewer().subscribe((res: any) => {
      console.log(res)
      if(res) {
        if(res.addressBook) {
        this.initialAddress = res.addressBook.nodes
      console.log(this.initialAddress)
      this.sortAddresses()}
    }
     })

    }

    makeDefault () {

    }

onNext(){

}


  onChooseShipping(address) {
    let addressToCart = {... address};
    delete addressToCart._id;
    delete addressToCart.__typename;
    for (let metafield of addressToCart.metafields) {
      delete metafield.__typename;
    }
    this.shippingAddress = address
    if (this.use === "shipping") {
      this.checkoutService.setAddress(addressToCart);
    }
    if (this.use === "billing") {
      this.checkoutService.saveBillingAddress(addressToCart);
    }


    // addressToCart.isShippingDefault = true;


  }
  onDeleteAddress(addressId) {
    console.log(addressId)
    this.checkoutService.deleteAddress(addressId).subscribe(res => {
      console.log(res)
      if (res) {
        const deletedReturned = res.data.removeAccountAddressBookEntry.address;
        console.log(deletedReturned)
        if (deletedReturned) {
          let updateItem = this.initialAddress.find(

            (item) => item._id === deletedReturned._id
          );
          console.log(updateItem)
          let updateItemIndex = this.initialAddress.indexOf(updateItem);
          console.log(updateItemIndex)
          if (updateItemIndex > -1) {
            this.initialAddress.splice(updateItemIndex, 1);
          }
        }

      }
    this.sortAddresses()})
  }
  addAddress() {
    const dialogRef = this.dialog.open(AddressesComponent, {
      maxWidth: 750,
      data: {
        currentAddress: this.newAddress,
        use: this.use
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      console.log("The dialog was closed", res);
    });
  }
  ngOnDestroy(){
    this.getViewer.unsubscribe()
  }
}
