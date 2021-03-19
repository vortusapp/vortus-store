import { environment } from './../../../../environments/environment';

import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subscriber, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product, ReactionProducts } from 'src/app/modals/product.model';
import { MatSnackBar } from '@angular/material';
import { map } from 'rxjs/operators';
import { GQLService } from './graphql.service';

import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';



// Get product from Localstorage
let products = JSON.parse(localStorage.getItem("compareItem")) || [];

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public currency : string = 'NZD';
  public catalogMode : boolean = false;
  public sale : boolean = false;

  // private _url: string = "assets/data/";
  public url = "assets/data/banners.json";

  public observer   :  Subscriber<{}>;

  private returnedProductArray: [];
  private individualProduct: ReactionProducts;
  private returnedProductToPush: Product;
  private mappedProductArray: Product[];
  private productsUpdated = new BehaviorSubject <Product[]>(null);
  private siteViewer = new BehaviorSubject <any>(null);
  private productsPrimaryImageArray;

  private returnedProduct;
  private mappedProduct;
  private singleProductUpdated = new BehaviorSubject <Product>(null);

  constructor(
    private httpClient: HttpClient,
    public snackBar: MatSnackBar,
    private apollo: Apollo,
    private gqlService: GQLService) {
  }
  public reactionViewer(){
    this.apollo
    .watchQuery<any>({
      query: this.lookupViewer,

    })
    .valueChanges.subscribe(res =>  {
      const viewer = res.data.viewer
      this.siteViewer.next(viewer)
    }
       )
  }

  public viewer(): Observable<{}> {
    this.reactionViewer();
    return this.siteViewer
  }
  public addressBookFragment = {
  entry: gql`
    fragment AddressBookFragment on AddressConnection{
      nodes {
        _id
        address1
        address2
        city
        company
      country
      firstName
        lastName
        fullName
        isBillingDefault
        isShippingDefault
        isCommercial
        phone
        postal
        region
        metafields {
          description
          key
        }
        }
    }`
}

  public lookupViewer = gql`
    query {viewer {
      _id
      username
      name
      primaryEmailAddress
      firstName
      lastName
      addressBook {
        ...AddressBookFragment
      }
    }}
    ${this.addressBookFragment.entry}
  `


  // This gets the product listings from reaction graphql
  private reactionProducts() {
    this.apollo
    .watchQuery<any>({
      variables: {
        "shopId": environment.PRIMARY_SHOP_ID
      },
      query:  gql`
      query catalogItemsQuery(
            $shopId: ID!,
            $first: ConnectionLimitInt,
            $last:  ConnectionLimitInt,
            $before: ConnectionCursor,
            $after: ConnectionCursor,
            $sortBy: CatalogItemSortByField,
            $sortByPriceCurrencyCode: String,
            $sortOrder: SortOrder) {
              catalogItems(
                shopIds: [$shopId],
                first: $first,
                last: $last,
                before: $before,
                after: $after,
                sortBy: $sortBy,
                sortByPriceCurrencyCode: $sortByPriceCurrencyCode,
                sortOrder: $sortOrder
                ) {
                totalCount
                pageInfo {
                  endCursor
                  startCursor
                  hasNextPage
                  hasPreviousPage
                }
                edges {
                  cursor
                  node {
                    _id
                    ... on CatalogItemProduct {
                      product {
                        _id
                         title
                        slug
                        description
                        vendor
                        pricing {
                          compareAtPrice {
                            displayAmount
                          }
                          displayPrice
                        }
                        primaryImage {
                          URLs {
                            small
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
        `,


    })

    .valueChanges.subscribe(res => {
      this.returnedProductArray = res.data.catalogItems.edges
      this.mappedProductArray = [];
      for (let returnedProduct of this.returnedProductArray) {
        this.individualProduct = returnedProduct
        this.returnedProductToPush = {}
        this.returnedProductToPush.id = this.individualProduct.node.product.slug
        this.returnedProductToPush.name = this.individualProduct.node.product.title
        this.returnedProductToPush.shortDetails = this.individualProduct.node.product.slug
        this.returnedProductToPush.description = this.individualProduct.node.product.description
        this.returnedProductToPush.brand = this.individualProduct.node.product.vendor
        if (this.individualProduct.node.product.primaryImage) {
          this.returnedProductToPush.pictures = []
          this.returnedProductToPush.pictures.push(this.individualProduct.node.product.primaryImage.URLs)

        }
        else {this.returnedProductToPush.pictures = [
          {
            small: "assets/images/product/v.png",
            large: "assets/images/product/v.png",
            big: "assets/images/product/v.png"
        },

        ]

        }
        this.mappedProductArray.push(this.returnedProductToPush)


      }
      this.productsUpdated.next([...this.mappedProductArray]);


    })
  }

  private ReactionProductDetails (productId: string) {
    // let productId = "cmVhY3Rpb24vY2F0YWxvZ0l0ZW06ZDIyYnl1bWtHb2N1SFlna3I="?
    this.apollo
    .watchQuery({
      variables: {
        slugOrId: productId
      },
      query:  gql`
      query catalogItemProductQuery($slugOrId: String!) {
        catalogItemProduct(slugOrId: $slugOrId) {
          product {
            _id
            productId
            title
            slug
            description
            vendor
            isLowQuantity
            isSoldOut
            isBackorder
            pricing {
              displayPrice
            }
            media {
              URLs {
                thumbnail
                small
                medium
                large
                original
              }
            }
            tags {
              nodes {
                name
              }
            }
            variants {
              _id
              variantId
              title
              optionTitle
              pricing {
                compareAtPrice {
                  displayAmount
                }
                displayPrice
              }
              canBackorder
              inventoryAvailableToSell
              isBackorder
              isSoldOut
              isLowQuantity
              options {
                _id
                variantId
                title
                pricing {
                  compareAtPrice {
                    displayAmount
                  }
                  displayPrice
                }
                optionTitle
                canBackorder
                inventoryAvailableToSell
                isBackorder
                isSoldOut
                isLowQuantity
                media {
                  URLs {
                    thumbnail
                    small
                    medium
                    large
                    original
                  }
                }
              }
              media {
                URLs {
                  thumbnail
                  small
                  medium
                  large
                  original
                }
              }
            }
          }
        }
      }
    `,


})

.valueChanges.subscribe(res => {
  this.returnedProduct = res
  this.mappedProduct = {};
    this.mappedProduct.id = this.returnedProduct.data.catalogItemProduct.product.slug
    this.mappedProduct.productId = this.returnedProduct.data.catalogItemProduct.product.productId
    this.mappedProduct.name = this.returnedProduct.data.catalogItemProduct.product.title
    this.mappedProduct.shortDetails = this.returnedProduct.data.catalogItemProduct.product.description
    this.mappedProduct.description = this.returnedProduct.data.catalogItemProduct.product.description
    this.mappedProduct.brand = this.returnedProduct.data.catalogItemProduct.product.vendor
    this.mappedProduct.price = this.returnedProduct.data.catalogItemProduct.product.pricing[0].displayPrice
    this.mappedProduct.variant = this.returnedProduct.data.catalogItemProduct.product.variants
    if (this.returnedProduct.data.catalogItemProduct.product.media[0]) {
    for (let pictures of this.returnedProduct.data.catalogItemProduct.product.media) {
      this.mappedProduct.pictures = [];
      this.mappedProduct.pictures.push(pictures.URLs)
    }}
    else {this.mappedProduct.pictures= [{small: "assets/images/product/v.png", medium: "assets/images/product/v.png", large: "assets/images/product/v.png", thumbnail: "assets/images/product/v.png", original: "assets/images/product/v.png"}]
  }


  this.singleProductUpdated.next({...this.mappedProduct});
})


}

  // This is what is called to get the product catalog listings
  private products(): Observable<Product[]> {
    this.reactionProducts();
    return this.productsUpdated
    // return this.httpClient.get<Product[]>('assets/data/products2.json');

  }

  public banners(): Observable<any[]>{
    return this.httpClient.get<any[]>(this.url);
  }


    // Get Banners
    public getBanners() {
      return this.banners();
    }

    // Get Banners

    // This is to get an individual product for the product detail page.
    // Call fro here wha it is that you want for a specific product.
    public getProducts(): Observable<Product[]> {
      // return this.products();
          // return this.httpClient.get<Product[]>('assets/data/products2.json');

      this.reactionProducts();
      return this.productsUpdated

    }

      // Get Products By Id
  public getProduct(id): Observable<Product> {
    this.ReactionProductDetails(id);
    return this.singleProductUpdated


    // return this.products().pipe(map(items => {
    //   return items.find((item: Product) =>
    //     { return item.id === 1; });
    //   }));
    // return this.products.find(product=> product.id === id);

    // return this.httpClient.get<Product>(this._url + 'product-' + id + '.json');


    }


  public getProductById(id): Observable<Product>{
    return this.httpClient.get<Product>(this.url + 'product-' + id + '.json');
}
  // Get Products By category
  public getProductByCategory(category: string): Observable<Product[]> {
    console.log()

    return this.products().pipe(map(items =>
       items.filter((item: Product) => {
         if(category == 'all')
            return item
            else
            return item.category === category;

       })
     ));
  }
}
