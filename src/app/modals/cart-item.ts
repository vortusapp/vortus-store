
import { Product } from './product.model';

// cart items
export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: string;
}

export interface Price  {
  amount?: number;
  currencyCode?: string;
}
export interface ProductConfiguration {
  productId?: string;
  productVariantId?: string
}

export interface Metafields {description: string, key: string, namespace: string, scope: string, value: string, valueType: string}
export interface Item {
  metafields?: Metafields[]
  price?: Price;
  productConfiguration?: ProductConfiguration;
  quantity?: number;

}
export class ChosenItem {
  item?: Item
  constructor (
    item?: Item
  ){
    this.item = item
  }
}
export class CartItems {
  cartItem: CartItem[];
  cartTotal: number;
}


