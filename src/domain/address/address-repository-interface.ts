import { ClientSession, Types } from "mongoose";
import { HydratedAddressDocument, Address } from "./address-entity";

export interface IAddressRepository {
  findById(
    tenantId: Types.ObjectId | string,
    addressId: string
  ): Promise<HydratedAddressDocument | null>;
  find(tenantId: Types.ObjectId | string): Promise<HydratedAddressDocument[]>;
  insert(
    tenantId: Types.ObjectId | string,
    address: Address,
    options?: { session: ClientSession }
  ): Promise<HydratedAddressDocument>;
  update(
    address: HydratedAddressDocument,
    changes?: Partial<Address>,
    options?: { session: ClientSession }
  ): Promise<HydratedAddressDocument>;
  delete(address: HydratedAddressDocument, options?: { session: ClientSession }): Promise<void>;
}
