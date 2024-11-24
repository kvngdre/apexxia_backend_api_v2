import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { DeleteCustomerCommand } from "./delete-customer-command";
import { Result, ResultType } from "@shared-kernel/result";
import { CustomerExceptions, ICustomerRepository } from "@domain/customer";
import { IAddressRepository } from "@domain/address";
import { ApplicationDbContext } from "@infrastructure/database";

@scoped(Lifecycle.ResolutionScoped)
export class DeleteCustomerCommandHandler implements IRequestHandler<DeleteCustomerCommand> {
  constructor(
    private readonly _appDbContext: ApplicationDbContext,
    @inject("CustomerRepository") private readonly _customerRepository: ICustomerRepository,
    @inject("AddressRepository") private readonly _addressRepository: IAddressRepository
  ) {}

  public async handle(command: DeleteCustomerCommand): Promise<ResultType<unknown>> {
    const customer = await this._customerRepository.findById(command.tenant.id, command.customerId);
    if (!customer) return Result.failure(CustomerExceptions.NotFound);

    const address = await this._addressRepository.findById(
      command.tenant.id,
      customer.residentialAddressId.toString()
    );

    // Persist with db transaction
    const session = await this._appDbContext.startTransactionSession(command.tenant.id);

    try {
      await session.withTransaction(async () => {
        await this._customerRepository.delete(customer, { session });
        if (address) {
          await this._addressRepository.delete(address, { session });
        }
      });
    } finally {
      await session.endSession();
    }

    return Result.success("Customer deleted successfully");
  }
}
