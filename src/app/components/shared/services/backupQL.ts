

// //Queries and mutations and fragments


// // viewCartFragments = {entry: gql`
// //  fragment CartItemConnectionFragment on CartItemConnection {
// //      pageInfo {
// //        hasNextPage
// //        endCursor
// //      }
// //      edges {
// //        node {
// //          _id
// //          productConfiguration {
// //            productId
// //            productVariantId
// //          }
// //          attributes {
// //            label
// //            value
// //          }
// //          createdAt
// //          inventoryAvailableToSell
// //          isBackorder
// //          isLowQuantity
// //          isSoldOut
// //          imageURLs {
// //            thumbnail
// //          }
// //          price {
// //            amount
// //          }
// //          priceWhenAdded {
// //            amount
// //          }
// //          quantity
// //          subtotal {
// //            amount
// //          }
// //          title
// //          productVendor
// //          variantTitle
// //          optionTitle
// //          taxes {
// //            _id
// //            jurisdictionId
// //            sourcing
// //            tax {
// //              amount
// //              currency {
// //                _id
// //                code
// //              }
// //              displayAmount
// //            }
// //            taxName
// //            taxRate {
// //              amount
// //              displayPercent
// //              percent
// //            }
// //            taxableAmount {
// //              amount
// //              currency {
// //                _id
// //                code
// //              }
// //              displayAmount
// //            }
// //          }
// //        }
// //      }
// //    }


// //    `}

// // addToCartFragments = {entry: gql`

// //     fragment CartFragment on Cart {
// //       _id
// //       email
// //       items {
// //         ...CartItemConnectionFragment
// //       }
// //       totalItemQuantity
// //     }

// //     fragment CartItemConnectionFragment on CartItemConnection {
// //       pageInfo {
// //         hasNextPage
// //         endCursor
// //       }
// //       edges {
// //         node {
// //           _id
// //           productConfiguration {
// //             productId
// //             productVariantId
// //           }
// //           attributes {
// //             label
// //             value
// //           }
// //           createdAt
// //           inventoryAvailableToSell
// //           isBackorder
// //           isLowQuantity
// //           isSoldOut
// //           imageURLs {
// //             thumbnail
// //           }
// //           price {
// //             amount
// //           }
// //           priceWhenAdded {
// //             amount
// //           }
// //           quantity
// //           subtotal {
// //             amount
// //           }
// //           title
// //           productVendor
// //           variantTitle
// //           optionTitle
// //         }
// //       }
// //     }

// //     fragment IncorrectPriceFailuresFragment on IncorrectPriceFailureDetails {
// //       currentPrice {
// //         amount
// //       }
// //       providedPrice {
// //         amount
// //       }
// //     }

// //     fragment MinOrderQuantityFailuresFragment on MinOrderQuantityFailureDetails {
// //       minOrderQuantity
// //       quantity
// //     }`}

// // deleteCartItemFragments = {entry: gql`
// // fragment CartFragment on Cart {
// //           _id
// //           email
// //           items {
// //             ...CartItemConnectionFragment
// //           }
// //           totalItemQuantity
// //         }
// //          fragment CartItemConnectionFragment on CartItemConnection {
// //           pageInfo {
// //             hasNextPage
// //             endCursor
// //           }
// //           edges {
// //             node {
// //               _id
// //               productConfiguration {
// //                 productId
// //                 productVariantId
// //               }
// //               attributes {
// //                 label
// //                 value
// //               }
// //               createdAt
// //               inventoryAvailableToSell
// //               isBackorder
// //               isLowQuantity
// //               isSoldOut
// //               imageURLs {
// //                 thumbnail
// //               }
// //               price {
// //                 amount
// //               }
// //               priceWhenAdded {
// //                 amount
// //               }
// //               quantity
// //               subtotal {
// //                 amount
// //               }
// //               title
// //               productVendor
// //               variantTitle
// //               optionTitle
// //             }
// //           }
// //         }


// // `}

// taxSummaryFragment = {entry: gql`
// fragment TaxSummaryFragment on TaxSummary{
//     calculatedAt
//     calculatedByTaxServiceName
//     referenceId
//   	tax {
//       amount
//       displayAmount
//     }
//     taxableAmount {
//       amount
//       displayAmount
//     }
//     taxes {
//       _id
//       tax {
//       amount
//       displayAmount
//     }
//       taxName
//       taxRate {
//       amount
//       displayPercent
//       percent

//     }
//     }
//     taxableAmount {
//       amount
//       displayAmount
//     }
//   }
// `}


// // createCartAdd = gql`
// //          mutation createCartMutation($input: CreateCartInput!) {
// //            createCart(input: $input) {
// //              cart {
// //              ...CartFragment
// //              }
// //              incorrectPriceFailures {
// //                ...IncorrectPriceFailuresFragment
// //              }
// //              minOrderQuantityFailures {
// //                ...MinOrderQuantityFailuresFragment
// //              }
// //              token
// //          }
// //        }
// //        ${this.addToCartFragments.entry}`

// // openCartAdd = gql`
// // mutation addCartItemsMutation($input: AddCartItemsInput!) {
// //   addCartItems(input: $input) {
// //     cart {
// //       ...CartFragment
// //     }
// //     incorrectPriceFailures {
// //       ...IncorrectPriceFailuresFragment
// //     }
// //     minOrderQuantityFailures {
// //       ...MinOrderQuantityFailuresFragment
// //     }
// //   }
// // }
// //   ${this.addToCartFragments.entry}`


// // queryViewCart = gql`
// // ${this.viewCartFragments.entry}
// // ${this.taxSummaryFragment.entry}


// // query anonymousCartByCartIdQuery($cartId: ID!, $token: String!, $itemsAfterCursor: ConnectionCursor) {
// // cart: anonymousCartByCartId(cartId: $cartId, cartToken: $token) {
// //   items(first: 50, after: $itemsAfterCursor) {
// //     ...CartItemConnectionFragment
// //   }
// //   taxSummary{
// //     ...TaxSummaryFragment
// //   }
// // }
// // }
// // `

// // mutationRemoveFromCart = gql`
// // mutation removeCartItemsMutation($input: RemoveCartItemsInput!) {
// //   removeCartItems(input: $input) {
// //     cart {
// //       ...CartFragment
// //     }
// //   }
// // }
// // ${this.deleteCartItemFragments.entry}
// // `

// // mutationChangeCartQuantity = gql`
// // mutation updateCartItemsQuantityMutation($input: UpdateCartItemsQuantityInput!) {
// //   updateCartItemsQuantity(input: $input) {
// //     cart {
// //       ...CartFragment
// //     }
// //   }
// // }
// // ${this.deleteCartItemFragments.entry}
// // `
// ///
