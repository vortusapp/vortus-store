
import { Component, OnInit, Inject } from "@angular/core";
import { CartService } from "../../../shared/services/cart.service";
import { CheckoutService } from "../../../shared/services/checkout.service";
import { Observable, of, Subscription } from "rxjs";
import { CartItem, CartItems } from "src/app/modals/cart-item";
import { Address } from "../../../../modals/checkout.model";
import { ProductService } from "../../../shared/services/product.service";
import {MatDialogRef} from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from "@angular/router"
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormGroup,
  FormBuilder
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
  selector: "app-addresses",
  templateUrl: "./addresses.component.html",
  styleUrls: ["./addresses.component.sass"],
})
export class AddressesComponent implements OnInit {
  public cartItems;
  // : Observable<CartItems> = of({cartItem: [], cartTotal: 0});
  public buyProducts;
  // : CartItems = {cartItem: [], cartTotal: 0}

  amount: number;
  payments: string[] = ["Create an Account?", "Flat Rate"];
  paymantWay: string[] = ["Trade Account", "Credit Card"];
  address: Address = {}
  shippingAddress: FormGroup
  metadata = []
  shippingMetadata = {
    description: "This address is used for shipping",
    key: "shipping"
  }
  billingMetadata = {
    description: "This address is used for billing",
    key: "billing"
  }


  //Form
  createFormGroup() {
  this.shippingAddress =  this.fb.group({
  firstNameFormControl: ["", [Validators.required]],
  lastNameFormControl: ["", [Validators.required]],
  companyFormControl: ["", [Validators.required]],
  address1FormControl: ["", [Validators.required]],
  address2FormControl: [""],
  suburbFormControl: [""],
  cityFormControl: ["", [Validators.required]],
  countryFormControl: ["", [Validators.required]],
  postcodeFormControl: [""],
  phoneFormControl: [""],
  notesFormControl: [""],
  isBillingFormControl: [this.isBilling],
  isShippingFormControl: [this.isShipping]

}

)

}


get firstNameFormControl(): FormControl {
  return this.shippingAddress.get('firstNameFormControl') as FormControl
}
get lastNameFormControl(): FormControl {
  return this.shippingAddress.get('lastNameFormControl') as FormControl
}
get companyFormControl(): FormControl {
  return this.shippingAddress.get('companyFormControl') as FormControl
}
get address1FormControl(): FormControl {
  return this.shippingAddress.get('address1FormControl') as FormControl
}
get cityFormControl(): FormControl {
  return this.shippingAddress.get('cityFormControl') as FormControl
}
get countryFormControl(): FormControl {
  return this.shippingAddress.get('countryFormControl') as FormControl
}


  isBilling = false
  isShipping = false
  matcher = new MyErrorStateMatcher();

  //

  constructor(
    private fb: FormBuilder,
    private checkoutService: CheckoutService,
    public productService: ProductService,
    private dialogRef: MatDialogRef<AddressesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // formState: any = null, validatorOrOpts?: ValidatorFn | AbstractControlOptions | ValidatorFn[], asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]


    ) {
      if (this.data.use === 'billing') (this.isBilling = true)
      if (this.data.use === 'shipping') (this.isShipping = true)
      this.createFormGroup()
   }

  ngOnInit() {
    this.addressBookLookup()
    console.log(this.data)
  }

  addressBookLookup () {
    this.productService.viewer()
    .subscribe(res => {
    console.log(res)})

  }

  onSave() {
    if (this.shippingAddress.controls.isShippingFormControl.value) {
      this.metadata.push(this.shippingMetadata)
      console.log(this.metadata)
    }
    if (this.shippingAddress.controls.isBillingFormControl.value) {
      this.metadata.push(this.billingMetadata)
      console.log(this.metadata)
    }
    if (true) {
      console.log(this.metadata)
      this.address =  {
        address1: this.shippingAddress.controls.address1FormControl.value,
        address2: this.shippingAddress.controls.address2FormControl.value,
        city: this.shippingAddress.controls.cityFormControl.value,
        postal: this.shippingAddress.controls.postcodeFormControl.value,
        region: this.shippingAddress.controls.suburbFormControl.value,
        country: this.shippingAddress.controls.countryFormControl.value,
        fullName: this.shippingAddress.controls.firstNameFormControl.value + " " + this.shippingAddress.controls.lastNameFormControl.value,
        firstName: this.shippingAddress.controls.firstNameFormControl.value,
        lastName: this.shippingAddress.controls.lastNameFormControl.value,
        phone: this.shippingAddress.controls.phoneFormControl.value,
        company: this.shippingAddress.controls.companyFormControl.value,
        isCommercial: true,
        isShippingDefault: true,
        isBillingDefault: true,
        metafields: this.metadata
      }
      console.log(this.address)
      this.checkoutService.addToAddressBook(this.address);
      this.dialogRef.close(this.address)
    }
  }

  onCancel () {
    this.dialogRef.close()
  }
}
