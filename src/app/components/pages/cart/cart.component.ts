import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subscription, pipe} from 'rxjs';
import { share } from 'rxjs/operators';
import { CartItem, CartItems } from 'src/app/modals/cart-item';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.sass']
})
export class CartComponent implements OnInit {

  // public cartItems : Observable<CartItem[]> = of([]);
  public shoppingCartItems : CartItem[];
  public shoppingCartValue = 0;

  private getCart: Subscription;

  constructor(private cartService: CartService) {

  }

  ngOnInit() {
    this.getCart = this.cartService.getItems().subscribe(shoppingCartItems => {
          this.shoppingCartItems = shoppingCartItems.cartItem;
          this.shoppingCartValue = shoppingCartItems.cartTotal;
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
  //  public getTotal() {
  //   return this.cartService.getTotalAmount();
  // }

}
