import { environment } from "./../../../../environments/environment.prod";
import { Injectable, OnInit } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { Apollo } from "apollo-angular";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "./../../../components/auth/core/auth.service";
import { GQLService } from "./graphql.service";
import { Product } from "src/app/modals/product.model";
import { CartItem, CartItems } from "src/app/modals/cart-item";


@Injectable({
  providedIn: "root",
})

export class CartService implements OnInit {
  constructor (
    public snackBar: MatSnackBar,
    private apollo: Apollo,
    private authService: AuthService,
    private cookieService: CookieService,
    private gqlService: GQLService
  ) {
    this.cartToken = this.cookieService.get("token");
    this.cartId = this.cookieService.get("cartId");
    this.authService.isAuthenticated$.subscribe((res) => {
      this.isLoggedIn = res;
      this.viewCart();
    });
  }

  public cartItems = new BehaviorSubject<CartItems>({
    cartItem: [],
    cartTotal: 0,
  });
  private isLoggedIn: boolean;
  public mappedCartItems: CartItem[] = [];
  private cartProduct: Product;
  private cartItem: CartItem;
  private cartToken: string;
  public cartId: string;
  public accountCartId: string = null;
  private createCartPayload;
  public fullCart;

  ngOnInit() {}

  public getItems(): Observable<CartItems> {
    this.viewCart();
    return this.cartItems;
  }

  private viewCart() {
    if (!this.cartToken && !this.cartId && this.authService.accountId) {
      console.log('new cart with no token and no id but logged in')
      this.apollo
        .query({
          variables: {
            accountId: this.authService.accountId,
            shopId: environment.PRIMARY_SHOP_ID
          },
          query: this.gqlService.viewAccountCart,
          errorPolicy: "all",
        })
        .subscribe((res) => {
          this.fullCart = res;
          if (this.fullCart.data.cart) {
            this.accountCartId = this.fullCart.data.cart._id;
            this.CartMap(this.fullCart.data.cart.items.edges, null);
          } else {
            this.fullCart = null;
            this.CartMap(null, null);
          }
        });
    }
    if (this.cartToken && this.cartId && !this.isLoggedIn) {
      this.apollo
        .query({
          variables: {
            cartId: this.cartId,
            token: this.cartToken,
          },
          query: this.gqlService.viewAnonymousCart,
          errorPolicy: "all",
        })
        .subscribe((res) => {
          this.fullCart = res;
          this.CartMap(this.fullCart.data.cart.items.edges, null);
        });
    }
    if (this.cartToken && this.cartId && this.isLoggedIn) {
      this.apollo
        .mutate({
          variables: {
            input: {
              anonymousCartId: this.cartId,
              cartToken: this.cartToken,
              shopId: environment.PRIMARY_SHOP_ID,
              mode: "merge",
            },
          },
          mutation: this.gqlService.cartReconciliation,
          refetchQueries: [
            {
              variables: {
                cartId: this.cartId,
                token: this.cartToken,
              },
              query: this.gqlService.viewAnonymousCart,
            },
          ],
          errorPolicy: "all",
        })
        .subscribe((res) => {
          this.fullCart = res;
          this.accountCartId = this.fullCart.data.cart._id;
          this.CartMap(this.fullCart.data.cart.items.edges, null);
          this.cookieService.delete("token");
          this.cookieService.delete("cartId");
        });
    }
  }

  public isCartOpen(itemsToAdd) {
    if (this.isLoggedIn && this.accountCartId) {
      this.addAccountCart(itemsToAdd);
    } else {
      if (this.cartId && this.cartToken) {
        this.addOpenCart(itemsToAdd);
      } else {
        if (this.isLoggedIn) {
          this.addNewAccountCart(itemsToAdd);
        } else {
          this.addNewAnonCart(itemsToAdd);
        }
      }
    }
  }

  private addNewAnonCart(itemsToAdd) {
    console.log('Added to new anon cart')
    this.apollo
      .mutate({
        variables: {
          input: {
            items: itemsToAdd,
            shopId: environment.PRIMARY_SHOP_ID,
          },
        },
        mutation: this.gqlService.addToNewCart,
        // refetchQueries: [
        //   {
        //     variables: {
        //       cartId: this.cartId,
        //       token: this.cartToken,
        //     },
        //     query: this.gqlService.viewAnonymousCart,
        //   },
        // ],
        errorPolicy: "all",
      })
      .subscribe((res) => {
        this.createCartPayload = res;
        /// ToDo also need tocheck for incorrectPriceFailures and MinOrderQuantityFailures
        if (this.isLoggedIn) {
          this.accountCartId = this.createCartPayload.data.createCart.cart._id;
        } else {
          this.cookieService.set(
            "cartId",
            this.createCartPayload.data.createCart.cart._id,
            null,
            null,
            null,
            null,
            null
          );
          this.cookieService.set(
            "token",
            this.createCartPayload.data.createCart.token,
            null,
            null,
            null,
            null,
            null
          );
          this.cartToken = this.createCartPayload.data.createCart.token;
          this.cartId = this.createCartPayload.data.createCart.cart._id;
        }
        this.CartMap(
          this.createCartPayload.data.createCart.cart.items.edges,
          itemsToAdd[0].productConfiguration.productId
        );
      });
  }

  private addNewAccountCart(itemsToAdd) {
    console.log('Added to new Account Cart')
    this.apollo
      .mutate({
        variables: {
          input: {
            items: itemsToAdd,
            shopId: environment.PRIMARY_SHOP_ID,
          },
        },
        mutation: this.gqlService.addToNewCart,
        // refetchQueries: [
        //   {
        //     variables: {
        //       accountId: this.authService.accountId,
        //       shopId: environment.PRIMARY_SHOP_ID,
        //     },
        //     query: this.gqlService.viewAccountCart,
        //   },
        // ],
        errorPolicy: "all",
      })
      .subscribe((res) => {
        this.createCartPayload = res;
        /// ToDo also need tocheck for incorrectPriceFailures and MinOrderQuantityFailures
        if (this.isLoggedIn) {
          this.accountCartId = this.createCartPayload.data.createCart.cart._id;
        } else {
          this.cookieService.set(
            "cartId",
            this.createCartPayload.data.createCart.cart._id,
            null,
            null,
            null,
            null,
            null
          );
          this.cookieService.set(
            "token",
            this.createCartPayload.data.createCart.token,
            null,
            null,
            null,
            null,
            null
          );
          this.cartToken = this.createCartPayload.data.createCart.token;
          this.cartId = this.createCartPayload.data.createCart.cart._id;
        }
        this.CartMap(
          this.createCartPayload.data.createCart.cart.items.edges,
          itemsToAdd[0].productConfiguration.productId
        );
      });
  }

private addOpenCart(itemsToAdd) {
  console.log('added to open cart')
    this.apollo
      .mutate({
        variables: {
          input: {
            items: itemsToAdd,
            cartId: this.cartId,
            cartToken: this.cartToken,
          },
        },
        mutation: this.gqlService.addToOpenCart,
        refetchQueries: [
          {
            variables: {
              cartId: this.cartId,
              token: this.cartToken,
            },
            query: this.gqlService.viewAnonymousCart,
          },
        ],
      })
      .subscribe((res: { data }) => {
        this.CartMap(
          res.data.addCartItems.cart.items.edges,
          itemsToAdd[0].productConfiguration.productId
        );
        ///also need tocheck for incorrectPriceFailures and MinOrderQuantityFailures
      });
  }

  private addAccountCart(itemsToAdd) {
    console.log('added to account cart')
    this.apollo
      .mutate({
        variables: {
          input: {
            items: itemsToAdd,
            cartId: this.accountCartId,
          },
        },
        mutation: this.gqlService.addToOpenCart,
        // refetchQueries: [
        //   {
        //     variables: {
        //       accountId: this.authService.accountId,
        //       shopId: environment.PRIMARY_SHOP_ID,
        //     },
        //     query: this.gqlService.viewAccountCart,
        //   },
        // ],
      })
      .subscribe((res: { data }) => {
        this.CartMap(
          res.data.addCartItems.cart.items.edges,
          itemsToAdd[0].productConfiguration.productId
        );
        ///also need tocheck for incorrectPriceFailures and MinOrderQuantityFailures
      });
  }

  private CartMap(productsReturned, itemChanged) {
    if (!productsReturned) {
      return;
    }
    let cartTotalArray = [];
    this.mappedCartItems = [];
    for (let productReturned of productsReturned) {
      let variantTitles = "";
      const attributes: [] = productReturned.node.attributes;
      for (let attribute of attributes) {
        const storedAttribute: { value } = attribute;
        if (!variantTitles) {
          variantTitles = storedAttribute.value;
        } else {
          variantTitles = variantTitles + " - " + storedAttribute.value;
        }
      }
      let itemImage;
      if (productReturned.node.imageUrls) {
        // ToDo set address to env variable
        itemImage = [
          "http://localhost:3000" + productReturned.node.imageURLs.thumbnail,
        ];
      } else {
        itemImage = ["assets/images/product/v.png"];
      }
      this.cartProduct = {
        id: productReturned.node._id,
        productId: productReturned.node.productConfiguration.productId,
        name: productReturned.node.title,
        price: productReturned.node.price.amount,
        pictures: itemImage,
        shortDetails: variantTitles,
        brand: productReturned.node.productVendor,
      };
      let quantity = productReturned.node.quantity;
      let subTotal = productReturned.node.subtotal.amount;
      cartTotalArray.push(subTotal);
      this.cartItem = {
        product: this.cartProduct,
        quantity: quantity,
        subtotal: subTotal,
      };
      this.mappedCartItems.push(this.cartItem);
    }
    let cartTotal = cartTotalArray.reduce((a, b) => a + b, 0);
    this.cartItems.next({
      cartItem: [...this.mappedCartItems],
      cartTotal: cartTotal,
    });
    if (itemChanged !== null) {
      let findItemChanged = this.mappedCartItems.find(
        (item) => item.product.productId == itemChanged
      );
      this.cartSnackbar(
        true,
        "Added " + findItemChanged.product.name + " to cart"
      );
    }
  }

  public cartSnackbar(status: boolean, message: string) {
    if (status === true) {
      this.snackBar.open(message, null, {
        panelClass: ["warning"],
        verticalPosition: "top",
        duration: 3000,
      });
    }
    if (status === false) {
      this.snackBar.open(message, null, {
        panelClass: ["error"],
        verticalPosition: "top",
        duration: 3000,
      });
    }
  }

  public removeFromCart(deleted: CartItem) {
    if (deleted === undefined) return false;
    if (!this.cartToken) {
      this.apollo
        .mutate({
          variables: {
            input: {
              cartId: this.accountCartId,
              cartItemIds: [deleted.product.id],
            },
          },
          mutation: this.gqlService.removeFromCart,
          // refetchQueries: [
          //   {
          //     variables: {
          //       accountId: this.authService.accountId,
          //       shopId: environment.PRIMARY_SHOP_ID,
          //     },
          //     query: this.gqlService.viewAccountCart,
          //   },
          // ],
          errorPolicy: "all",
        })
        .subscribe((res: { data }) => {
          const productReturned = res.data.removeCartItems.cart.items.edges[0];
          if (productReturned) {
            let updateItem = this.mappedCartItems.find(
              (item) => item.product.id == deleted.product.id
            );
            let updateItemIndex = this.mappedCartItems.indexOf(updateItem);
            if (updateItemIndex > -1) {
              this.mappedCartItems.splice(updateItemIndex, 1);
            }
          } else {
            this.mappedCartItems = [];
          }
          let cartTotalArray = [];
          for (let item of this.mappedCartItems) {
            cartTotalArray.push(item.subtotal);
          }
          let cartTotal = cartTotalArray.reduce((a, b) => a + b, 0);
          this.cartItems.next({
            cartItem: [...this.mappedCartItems],
            cartTotal: cartTotal,
          });
        });
    } else {
      this.apollo
        .mutate({
          variables: {
            input: {
              cartId: this.cartId,
              cartItemIds: [deleted.product.id],
              cartToken: this.cartToken,
            },
          },
          mutation: this.gqlService.removeFromCart,
          refetchQueries: [
            {
              variables: {
                cartId: this.cartId,
                token: this.cartToken,
              },
              query: this.gqlService.viewAnonymousCart,
            },
          ],
          errorPolicy: "all",
        })
        .subscribe((res: { data }) => {
          const productReturned = res.data.removeCartItems.cart.items.edges[0];
          if (productReturned) {
            let updateItem = this.mappedCartItems.find(
              (item) => item.product.id == deleted.product.id
            );
            let updateItemIndex = this.mappedCartItems.indexOf(updateItem);
            if (updateItemIndex > -1) {
              this.mappedCartItems.splice(updateItemIndex, 1);
            }
          } else {
            this.mappedCartItems = [];
          }
          let cartTotalArray = [];
          for (let item of this.mappedCartItems) {
            cartTotalArray.push(item.subtotal);
          }
          let cartTotal = cartTotalArray.reduce((a, b) => a + b, 0);
          this.cartItems.next({
            cartItem: [...this.mappedCartItems],
            cartTotal: cartTotal,
          });
        });
    }
  }

  public updateCartQuantity(product: Product, quantity: number) {
    let input;
    if (!this.cartToken) {
      input = {
        cartId: this.cartId,
        items: [{ cartItemId: product.id, quantity: quantity }],
        cartToken: this.cartToken,
      };
      // todo is this right or should there be an else?
      input = {
        cartId: this.accountCartId,
        items: [{ cartItemId: product.id, quantity: quantity }],
      };
    }
    this.apollo
      .mutate({
        variables: {
          input: input,
        },
        mutation: this.gqlService.changeCartQuantity,
        // refetchQueries: [{
        //   variables: {
        //   'cartId': this.cartId,
        //   'token': this.cartToken
        //   },
        //   query: this.gqlService.viewAnonymousCart
        // }],
        errorPolicy: "all",
      })
      .subscribe((res: { data }) => {
        const productReturned =
          res.data.updateCartItemsQuantity.cart.items.edges;
        let updateItem = this.mappedCartItems.find(
          (item) => item.product.id == product.id
        );
        let updateItemIndex = this.mappedCartItems.indexOf(updateItem);
        let newItem = updateItem;
        newItem.quantity = quantity;
        newItem.subtotal =
          productReturned[updateItemIndex].node.subtotal.amount;
        this.mappedCartItems[updateItemIndex] = newItem;
        let cartTotalArray = [];
        for (let item of this.mappedCartItems) {
          cartTotalArray.push(item.subtotal);
        }
        let cartTotal = cartTotalArray.reduce((a, b) => a + b, 0);
        this.cartItems.next({
          cartItem: [...this.mappedCartItems],
          cartTotal: cartTotal,
        });
      });
  }

  emptyCart() {
    this.cookieService.delete("accountCartId");
    this.cartId = undefined;
    this.cartToken = undefined;
    // ToDo does the accountCartId need deleting when logging out If it is deleted here it prevents adding things to new cart once checked out
    this.accountCartId = undefined;
    this.cartItems.next({ cartItem: [], cartTotal: null });
  }
}
