export interface Party {
  companyName: string;
  address: Address;
  primaryPhoneNumber: string;
  type: "Distributor" | "Dealer";
}

export type Address = {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  country: string;
};
