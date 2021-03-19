import { ProductConfiguration } from './../../../modals/cart-item';
import { Injectable } from '@angular/core';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})

export class GQLService {
  constructor() { }

  public moneyFragment = {
    entry: gql`
      fragment MoneyFragment on Money {
        amount
        currency {
          _id
          code
          decimal
          format
          rate
          scale
          symbol
          thousand
        }
        displayAmount
      }
    `
  }

  public rateFragment = {
    entry: gql`
      fragment RateFragment on Rate {
        amount
        displayPercent
        percent
      }
    `
  }

  public addressFragment = {
    entry: gql`
      fragment AddressFragment on Address {
        _id
        address1
        address2
        city
        company
        country
        firstName
        fullName
        isBillingDefault
        isCommercial
        isShippingDefault
        lastName
        metafields {
          description
          key
        }
        phone
        postal
        region
      }

    `
  }

  public fulfillmentMethodFragment = {
    entry: gql`
      fragment FulfillmentMethodFragment on FulfillmentMethod {
        _id
        carrier
        displayName
        fulfillmentTypes
        group
        name
      }

    `
  }

  public cartItemConnectionFragment = {
    entry: gql`
      fragment CartItemConnectionFragment on CartItemConnection {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            _id
            productConfiguration {
              productId
              productVariantId
            }
            attributes {
              label
              value
            }
            createdAt
            inventoryAvailableToSell
            isBackorder
            isLowQuantity
            isSoldOut
            imageURLs {
              thumbnail
            }
            price {
              ...MoneyFragment
            }
            priceWhenAdded {
              ...MoneyFragment
            }
            quantity
            subtotal {
              ...MoneyFragment
            }
            title
            productVendor
            variantTitle
            optionTitle
          }
        }
      }
      ${this.moneyFragment.entry}
    `
  }

    public taxSummaryFragment = {entry: gql`
  fragment TaxSummaryFragment on TaxSummary{
    calculatedAt
    calculatedByTaxServiceName
    referenceId
    tax {
      ...MoneyFragment
    }
    taxableAmount {
      ...MoneyFragment
    }
    taxes {
      _id
      tax {
        amount
        displayAmount
      }
      taxName
      taxRate {
        ...RateFragment
      }
      taxableAmount {
        ...MoneyFragment
      }
    }
  }
  ${this.moneyFragment.entry}
  ${this.rateFragment.entry}
`}


  public checkoutFragment = {
    entry: gql`
      fragment CheckoutFragment on Checkout{
        fulfillmentGroups{
          _id
          availableFulfillmentOptions{
            fulfillmentMethod{
              ...FulfillmentMethodFragment
            }
            handlingPrice{
              ...MoneyFragment
            }
            price {
              ...MoneyFragment
            }
          }
          data{
            shippingAddress{
              ...AddressFragment
            }
          }
          items {
            _id
            price{
              amount
            }
            subtotal {
              ...MoneyFragment
            }
          #  productConfiguration {
          #     productId
          #     productVariantId
          #   }
            quantity
          }
        }
        summary{
          discountTotal{
            ...MoneyFragment
          }
          total{
            ...MoneyFragment
          }
          taxTotal{
            ...MoneyFragment
          }
          effectiveTaxRate{
            ...RateFragment
          }
        }
      }


    ${this.moneyFragment.entry}
    ${this.rateFragment.entry}
    ${this.addressFragment.entry}
    ${this.fulfillmentMethodFragment.entry}
    `



  }

  public cartItemFragment = {
    entry: gql`
      fragment CartFragment on Cart {
        _id
        email
        items {
          ...CartItemConnectionFragment
        }
        taxSummary{
          ...TaxSummaryFragment
        }
        checkout{
          ...CheckoutFragment
        }
        totalItemQuantity


      }
      ${this.taxSummaryFragment.entry}
      ${this.checkoutFragment.entry}
      ${this.cartItemConnectionFragment.entry}

    `
  }


  public addCartErrorFragments = {
    entry: gql`
      fragment IncorrectPriceFailuresFragment on IncorrectPriceFailureDetails {
      currentPrice {
        amount
      }
      providedPrice {
        amount
      }
    }

    fragment MinOrderQuantityFailuresFragment on MinOrderQuantityFailureDetails {
      minOrderQuantity
      quantity
    }
    `
  }

  public orderFragment = {
    entry: gql`
      fragment OrderFragment on Order{
        _id
        cartId
        createdAt
        email
        status
      }`
  }

  public viewAnonymousCart = gql`
    query anonymousCartByCartIdQuery(
      $cartId: ID!,
      $token: String!,
      $itemsAfterCursor: ConnectionCursor
    ){
      cart: anonymousCartByCartId(cartId: $cartId, cartToken: $token){
        _id
        email
        items(first: 50, after: $itemsAfterCursor) {
          ...CartItemConnectionFragment
        }
        taxSummary{
          ...TaxSummaryFragment
        }
        checkout{
          ...CheckoutFragment
        }
      }
    }
    ${this.cartItemConnectionFragment.entry}
    ${this.taxSummaryFragment.entry}
    ${this.checkoutFragment.entry}
  `

public viewAccountCart = gql`
query accountCartByAccountIdQuery(
  $accountId: ID!,
  $shopId: ID!,
  $itemsAfterCursor: ConnectionCursor
){
  cart: accountCartByAccountId(accountId: $accountId, shopId: $shopId){
    _id
    email
    items(first: 50, after: $itemsAfterCursor) {
      ...CartItemConnectionFragment
    }
    taxSummary{
      ...TaxSummaryFragment
    }
    checkout{
      ...CheckoutFragment
    }
  }
}
${this.cartItemConnectionFragment.entry}
${this.taxSummaryFragment.entry}
${this.checkoutFragment.entry}
`

  public availablePaymentMethods = gql`
    query availablePaymentMethods(
      $shopId: ID!
    ){
      availablePaymentMethods(shopId: $shopId){
        canRefund
        displayName
        isEnabled
        name
        pluginName
      }
    }
  `

  public addToNewCart = gql`
    mutation createCartMutation($input: CreateCartInput!){
      createCart(input: $input){
        cart {
          ...CartFragment
        }
        incorrectPriceFailures{
          ...IncorrectPriceFailuresFragment
        }
        minOrderQuantityFailures{
          ...MinOrderQuantityFailuresFragment
        }
        token
      }
    }
    ${this.cartItemFragment.entry}
    ${this.addCartErrorFragments.entry}
  `

  public addToOpenCart = gql`
    mutation addCartItemsMutation($input: AddCartItemsInput!){
      addCartItems(input: $input) {
        cart {
          ...CartFragment
        }
        incorrectPriceFailures {
          ...IncorrectPriceFailuresFragment
        }
        minOrderQuantityFailures {
          ...MinOrderQuantityFailuresFragment
        }
      }
    }
    ${this.cartItemFragment.entry}
    ${this.addCartErrorFragments.entry}
  `



  public removeFromCart = gql`
    mutation removeCartItemsMutation($input: RemoveCartItemsInput!) {
      removeCartItems(input: $input) {
        cart {
          ...CartFragment
        }
      }
    }
    ${this.cartItemFragment.entry}
  `
  public changeCartQuantity = gql`
    mutation updateCartItemsQuantityMutation($input: UpdateCartItemsQuantityInput!) {
      updateCartItemsQuantity(input: $input) {
        cart {
          ...CartFragment
        }
      }
    }
    ${this.cartItemFragment.entry}
  `
  public addEmailToCart =  gql`
    mutation SetEmailOnAnonymousCart ($input: SetEmailOnAnonymousCartInput!) {
     setEmailOnAnonymousCart(input: $input){
        cart {...CartFragment}
        clientMutationId
      }
    }
   ${this.cartItemFragment.entry}
  `

  public addAddressToCart = gql`
  mutation setShippingAddressOnCart($input: SetShippingAddressOnCartInput!){
      setShippingAddressOnCart (input: $input){
        cart {...CartFragment}
        clientMutationId
      }
    }
    ${this.cartItemFragment.entry}

  `
  public updateFulfillmentOptionsForGroup = gql`
    mutation updateFulfillmentOptionsForGroup (
      $input: UpdateFulfillmentOptionsForGroupInput!){
      updateFulfillmentOptionsForGroup (input: $input){
        cart {...CartFragment}
        clientMutationId
      }
    }
  ${this.cartItemFragment.entry}
  `

 public placeOrder = gql`
  mutation placeOrder ($input: PlaceOrderInput!){
    placeOrder (input: $input){
      clientMutationId
      orders {
        ...OrderFragment
      }
      token
    }

  }
  ${this.orderFragment.entry}
 `

  public cartReconciliation = gql`
    mutation ($input: ReconcileCartsInput!){
  reconcileCarts(input: $input){
    cart{
      ...CartFragment
    }
  }
}
    ${this.cartItemFragment.entry}
    `

public addToAddressBook = gql`
  mutation addAccountBookEntry($input: AddAccountAddressBookEntryInput!) {
      addAccountAddressBookEntry(input: $input) {
        address {
          ...AddressFragment
        }
  }
}
  ${this.addressFragment.entry}
  `

  public removeAccountAddressBookEntry = gql`
    mutation removeAccountAddressBookEntry($input: RemoveAccountAddressBookEntryInput!) {
      removeAccountAddressBookEntry (input: $input) {
        address {
          ...AddressFragment
        }
      }
    }
    ${this.addressFragment.entry}
  `


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
        metafields{
          description
          key
        }
        }
    }`
}

  public viewer = gql`
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

}


