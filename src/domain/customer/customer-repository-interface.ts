import { ClientSession, Types } from "mongoose";
import { Customer, HydratedCustomerDocument } from "./customer-entity";

export interface ICustomerRepository {
  findById(
    tenantId: Types.ObjectId | string,
    customerId: string
  ): Promise<HydratedCustomerDocument | null>;
  find(tenantId: Types.ObjectId | string): Promise<HydratedCustomerDocument[]>;
  insert(
    tenantId: Types.ObjectId | string,
    customer: Customer,
    options?: { session: ClientSession }
  ): Promise<HydratedCustomerDocument>;
  update(
    customer: HydratedCustomerDocument,
    changes?: Partial<Customer>,
    options?: { session: ClientSession }
  ): Promise<HydratedCustomerDocument>;
  delete(customer: HydratedCustomerDocument, options?: { session: ClientSession }): Promise<void>;
  isBVNUnique(tenantId: Types.ObjectId | string, bvn: string): Promise<boolean>;
  isIdNumberUnique(tenantId: Types.ObjectId | string, idNumber: string): Promise<boolean>;
  isAccountNumberUnique(tenantId: Types.ObjectId | string, accountNumber: string): Promise<boolean>;
}
