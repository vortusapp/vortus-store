import { environment } from './../../../../environments/environment';
import { Component, OnInit, Input, OnDestroy, OnChanges} from '@angular/core';
import { Product } from 'src/app/modals/product.model';
import { CartService } from '../services/cart.service';
import { Observable, of, Subscription } from 'rxjs';
import { share } from 'rxjs/operators'
import { CartItem, CartItems } from 'src/app/modals/cart-item';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-shopping-widgets',
  templateUrl: './shopping-widgets.component.html',
  styleUrls: ['./shopping-widgets.component.sass']
})
export class ShoppingWidgetsComponent implements OnInit {

//   products: Product[];
//   indexProduct: number;
//   public product            :   Product;
//   public sidenavMenuItems:Array<any>;
//   private getCart: Subscription;

//   @Input() public shoppingCartItems: CartItem[] = [];

//   constructor(private cartService: CartService, public productService: ProductService) {
//   }

//   ngOnInit() {
//     this.getCart = this.cartService.getItems().subscribe(shoppingCartItems => {
//       this.shoppingCartItems = shoppingCartItems;
//     });}


//   public updateCurrency(curr) {
//     this.productService.currency = curr;
//   }


//   public removeItem(item: CartItem) {
//     this.cartService.removeFromCart(item);
//   }

//   public getTotal(): Observable<number> {
//     return this.cartService.getTotalAmount();
//   }

//   ngOnDestroy() {
//     this.getCart.unsubscribe()
//   }

// }

// public cartItems : Observable<CartItem[]> = of([]);
public shoppingCartItems : CartItem[] = []
public shoppingCartValue = 0
currency = environment.CURRENCY

private getCart: Subscription;

constructor(private cartService: CartService) {

}

ngOnInit() {
  // this.cartService.viewCart()
  // this.cartService.getItems();
  this.getCart = this.cartService.getItems().subscribe(shoppingCartItems => {
        this.shoppingCartItems = shoppingCartItems.cartItem;
        this.shoppingCartValue = shoppingCartItems.cartTotal
      });
}

ngOnDestroy() {
  this.getCart.unsubscribe()
}


  // Remove cart items
  public removeItem(item: CartItem) {
    this.cartService.removeFromCart(item);
  }


 // Increase Product Quantity
 public increment(product: any, quantity: any) {
  let newTotal = quantity + 1
  this.cartService.updateCartQuantity(product, newTotal)

}

// Decrease Product Quantity
public decrement(product: any, quantity: any) {
  let newTotal = quantity + -1
  this.cartService.updateCartQuantity(product, newTotal)

}
 // Get Total
 public getTotal() {}
//  : Observable<number> {
  // return this.cartService.getTotalAmount();
// }

}
