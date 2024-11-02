import { ClientSession } from "mongoose";
import { HydratedAddressDocument, Address } from "./address-entity";

export interface IAddressRepository {
  findById(addressId: string): Promise<HydratedAddressDocument | null>;
  find(): Promise<HydratedAddressDocument[]>;
  insert(address: Address, options?: { session: ClientSession }): Promise<HydratedAddressDocument>;
  update(
    address: HydratedAddressDocument,
    changes?: Partial<Address>,
    options?: { session: ClientSession }
  ): Promise<HydratedAddressDocument>;
  delete(address: HydratedAddressDocument): Promise<void>;
}
