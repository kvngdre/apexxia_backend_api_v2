import { ClientSession } from "mongoose";
import { injectable } from "tsyringe";
import { ApplicationDbContext } from "@infrastructure/database";
import { Address, HydratedAddressDocument, IAddressRepository } from "@domain/address";

@injectable()
export class AddressRepository implements IAddressRepository {
  constructor(private readonly _dbContext: ApplicationDbContext) {}

  public async findById(
    tenantId: string,
    addressId: string
  ): Promise<HydratedAddressDocument | null> {
    return (await this._dbContext.addresses(tenantId)).findById(addressId);
  }

  public async find(tenantId: string): Promise<HydratedAddressDocument[]> {
    return (await this._dbContext.addresses(tenantId)).find();
  }

  public async insert(
    tenantId: string,
    address: Address,
    options?: { session: ClientSession }
  ): Promise<HydratedAddressDocument> {
    const [newAddress] = await (
      await this._dbContext.addresses(tenantId)
    ).create([address], options);
    return newAddress!;
  }

  public async update(
    address: HydratedAddressDocument,
    changes: Partial<Address> = {},
    options?: { session: ClientSession }
  ): Promise<HydratedAddressDocument> {
    return address.updateOne(Object.assign({ ...Address, _id: undefined }, changes), {
      new: true,
      session: options?.session
    });
  }

  public async delete(
    address: HydratedAddressDocument,
    options?: { session: ClientSession }
  ): Promise<void> {
    await address.deleteOne({ session: options?.session });
  }

  public async isBVNUnique(tenantId: string, bvn: string) {
    const matches = await (await this._dbContext.addresses(tenantId)).find({ bvn });

    return matches.length < 1;
  }
}
