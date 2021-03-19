import { AuthService } from "./../../../../components/auth/core/auth.service";
import { Router } from "@angular/router";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { AddressesComponent } from "./../addresses/addresses.component";
import { ProductConfiguration } from "../../../../modals/cart-item";
import { environment } from "../../../../../environments/environment";
import { PaymentMethods } from "../../../../modals/checkout.model";
import { Component, OnInit } from "@angular/core";
import { CheckoutService } from "../../../shared/services/checkout.service";
import { Subscription } from "rxjs";
import { ProductService } from "../../../shared/services/product.service";
import { CartService } from "../../../shared/services/cart.service";
import { isNullOrUndefined } from 'util';

@Component({
  selector: "app-place-order",
  templateUrl: "./place-order.component.html",
  styleUrls: ["./place-order.component.scss"],
})
export class PlaceOrderComponent implements OnInit {
  private getCart: Subscription;
  private getPaymentMethods: Subscription;
  private getViewer: Subscription;
  public cartItems;
  public buyProducts = [];

  paymentMethods;

  taxSummary;
  checkoutItems;
  cartSubtotal: number;
  freightCharges: number;
  cartTotal: number;
  fullCart;
  cartId = "";
  primaryEmailAddress;
  shippingAddress = undefined;
  billingAddress = undefined;
  isLoggedIn;

  constructor(
    private checkoutService: CheckoutService,
    private cartService: CartService,
    public productService: ProductService,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe((res) => {
      this.updatePaymentMethods()
      if (res) {
        this.updateCart()

        if (!this.cartService.accountCartId) {
          this.updatePaymentMethods();
        }
        //  else {
        //   this.cartService
        //     .getItems()
        //     .subscribe(() => this.updatePaymentMethods());
        // }
      }
    });
  }

  updatePaymentMethods() {
    this.getPaymentMethods = this.checkoutService
      .getPaymentMethods()
      .subscribe((paymentMethods) => {
        // console.log(paymentMethods);
        this.paymentMethods = paymentMethods;
      });
    }

  updateCart () {
    this.getCart = this.checkoutService.getItems().subscribe((res) => {
      console.log(res)
      if (res) {
      if (res.data.updateFulfillmentOptionsForGroup) {
        this.fullCart = res.data.updateFulfillmentOptionsForGroup.cart;
      } else {
        this.fullCart = res.data.cart;

      }
      console.log(this.fullCart)
      this.shippingAddress = this.fullCart.checkout.fulfillmentGroups[0].data.shippingAddress;

      this.buyProducts = this.fullCart.items.edges;
      this.taxSummary = this.fullCart.taxSummary;
      this.checkoutItems = this.fullCart.checkout;
      if (
        this.checkoutItems.fulfillmentGroups[0].availableFulfillmentOptions
          .length > 0
      ) {
        this.freightCharges = this.checkoutItems.fulfillmentGroups[0].availableFulfillmentOptions[0].price.amount;
      }
      this.cartSubtotal = 0;
      if (this.buyProducts.length) {
        for (let itemTotal of this.buyProducts) {
          this.cartSubtotal =
            this.cartSubtotal + itemTotal.node.subtotal.amount;
        }
      }}
    });

    this.checkoutService.saveBillingAddress().subscribe(res =>{
      if (res) {
      this.billingAddress = res}}
    )


    this.getViewer = this.productService.viewer().subscribe((res: any) => {
      if(res) {
        this.primaryEmailAddress = res.primaryEmailAddress;
      }

    });




  }
  ngOnDestroy() {
    this.getCart.unsubscribe();
    this.getPaymentMethods.unsubscribe();
    this.getViewer.unsubscribe();
  }

  addAddress(use) {
    const dialogRef = this.dialog.open(AddressesComponent, {
      maxWidth: 750,
      data: {
        currentAddress: isNullOrUndefined,
        use: use
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      console.log("The dialog was closed", res);
    });
  }

  onPlaceOrder() {
    let cartItems = [];
    this.buyProducts.forEach((item) => {
      let cartItem = {
        productConfiguration: {
          productId: item.node.productConfiguration.productId,
          productVariantId: item.node.productConfiguration.productVariantId,
        },
        price: item.node.price.amount,
        quantity: item.node.quantity,
      };
      cartItems.push(cartItem);
    });
    let placeOrderInput = {

      order: {
        cartId: this.fullCart._id,
        shopId: environment.PRIMARY_SHOP_ID,
        fulfillmentGroups: {
          selectedFulfillmentMethodId:
            "cmVhY3Rpb24vZnVsZmlsbG1lbnRNZXRob2Q6RHpjNHlncWplVG14TVd5cDg=",
          shopId: environment.PRIMARY_SHOP_ID,
          items: cartItems,
          type: "shipping",
        },
        currencyCode: "USD",
        email: this.primaryEmailAddress,
      },
      payments: {
        amount: this.freightCharges + this.cartSubtotal,
        method: "iou_example",

        //todo Fix payment section to reflect actual payment
        //todo find how to do tax exclusive
      },
    };

    console.log(placeOrderInput);
    this.checkoutService.placeOrder(placeOrderInput);
  }
}
