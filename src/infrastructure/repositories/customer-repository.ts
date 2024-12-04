import { ClientSession } from "mongoose";
import { injectable } from "tsyringe";
import { ApplicationDbContext } from "@infrastructure/database";
import { Customer, HydratedCustomerDocument, ICustomerRepository } from "@domain/customer";

@injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(private readonly _dbContext: ApplicationDbContext) {}

  public async findById(
    tenantId: string,
    customerId: string
  ): Promise<HydratedCustomerDocument | null> {
    return (await this._dbContext.customers(tenantId)).findById(customerId);
  }

  public async find(tenantId: string): Promise<HydratedCustomerDocument[]> {
    return (await this._dbContext.customers(tenantId)).find();
  }

  public async insert(
    tenantId: string,
    customer: Customer,
    options?: { session: ClientSession }
  ): Promise<HydratedCustomerDocument> {
    const [newCustomer] = await (
      await this._dbContext.customers(tenantId)
    ).create([customer], options);
    return newCustomer!;
  }

  public async update(
    customer: HydratedCustomerDocument,
    changes: Partial<Customer> = {},
    options?: { session: ClientSession }
  ): Promise<HydratedCustomerDocument> {
    return customer.updateOne(Object.assign({ ...Customer, _id: undefined }, changes), {
      new: true,
      session: options?.session
    });
  }

  public async delete(
    customer: HydratedCustomerDocument,
    options?: { session: ClientSession }
  ): Promise<void> {
    await customer.deleteOne({ session: options?.session });
  }

  public async isBVNUnique(tenantId: string, bvn: number) {
    const matches = await (await this._dbContext.customers(tenantId)).find({ bvn });

    return matches.length < 1;
  }

  public async isIdNumberUnique(tenantId: string, idNumber: string) {
    const matches = await (await this._dbContext.customers(tenantId)).find({ idNumber });

    return matches.length < 1;
  }

  public async isAccountNumberUnique(tenantId: string, accountNumber: string) {
    const matches = await (await this._dbContext.customers(tenantId)).find({ accountNumber });

    return matches.length < 1;
  }
}
