import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { CreateCustomerCommand } from "./create-customer-command";
import { CustomerResponseDto } from "../../shared/customer-response-dto";
import { Result, ResultType } from "@shared-kernel/result";
import { CreateCustomerCommandValidator } from "./create-customer-command-validator";
import { Customer, ICustomerRepository } from "@domain/customer";
import { Address, IAddressRepository } from "@domain/address";
import { ApplicationDbContext } from "@infrastructure/database";

@scoped(Lifecycle.ResolutionScoped)
export class CreateCustomerCommandHandler
  implements IRequestHandler<CreateCustomerCommand, CustomerResponseDto>
{
  constructor(
    private readonly _appDbContext: ApplicationDbContext,
    private readonly _validator: CreateCustomerCommandValidator,
    @inject("AddressRepository") private readonly _addressRepository: IAddressRepository,
    @inject("CustomerRepository") private readonly _customerRepository: ICustomerRepository
  ) {}

  public async handle(command: CreateCustomerCommand): Promise<ResultType<CustomerResponseDto>> {
    // Validating command...
    const { isFailure, exception, value } = this._validator.validate(command);
    if (isFailure) return Result.failure(exception);

    const address = new Address(
      value.residentialAddress.addressLine1,
      value.residentialAddress.city,
      value.residentialAddress.state,
      value.residentialAddress.latitude,
      value.residentialAddress.longitude,
      value.residentialAddress.addressLine2,
      "residential"
    );

    const customer = new Customer(
      value.lenderId,
      value.firstName,
      value.middleName,
      value.lastName,
      value.gender,
      value.dateOfBirth,
      address._id,
      value.phone,
      value.email,
      value.maritalStatus,
      value.bvn,
      value.idType,
      value.idNumber,
      value.idExpiration,
      value.nextOfKin,
      value.accountName,
      value.accountNumber,
      value.bank
    );

    // Persist with db transaction
    const session = await this._appDbContext.startTransactionSession(value.tenant.id);

    try {
      await session.withTransaction(async () => {
        await this._addressRepository.insert(value.tenant.id, address, { session });
        await this._customerRepository.insert(value.tenant.id, customer, { session });
      });
    } finally {
      await session.endSession();
    }

    return Result.success("Customer created successfully", CustomerResponseDto.from(customer));
  }
}
