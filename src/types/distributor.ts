import { Address, Party } from "./common";

export interface Distributor extends Party {}

export interface SalesPerson {
  firstName: string;
  lastName: string;
  primaryPhoneNumber: string;
  address: Address;
}
