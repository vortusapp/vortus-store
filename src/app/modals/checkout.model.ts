export class Address {
  _id?: string;
  address1?: string;
  address2?: string;
  city?: string;
  company?: string;
  country?: string;
  firstName?: string;
  fullName?: string;
  isBillingDefault?: boolean;
  isCommercial?: boolean;
  isShippingDefault?: boolean;
  lastName?: string;
  metafields?: Metafield[];
  phone?: string;
  postal?: string;
  region?: string;
  addressName?: string;
  }
  export class Metafield {
    description?: string;
    key?: string;
    namespace?: string;
    scope?: string;
    value?: string;
    valueType?: string;
  }

  export class PaymentMethods{
      canRefund: boolean;
      displayName: string;
      isEnabled: boolean;
      name: string;
      pluginName: string;
  }

