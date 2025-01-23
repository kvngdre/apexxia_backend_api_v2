import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { CreateCustomerCommand } from "./create-customer-command";
import { CustomerResponseDto } from "../../shared/customer-response-dto";
import { Result, ResultType } from "@shared-kernel/result";
import { CreateCustomerCommandValidator } from "./create-customer-command-validator";
import { Customer, CustomerExceptions, ICustomerRepository } from "@domain/customer";
import { Address, IAddressRepository } from "@domain/address";
import { ApplicationDbContext } from "@infrastructure/database";
import { Publisher } from "@infrastructure/pubsub/publisher";

@scoped(Lifecycle.ResolutionScoped)
export class CreateCustomerCommandHandler
  extends Publisher
  implements IRequestHandler<CreateCustomerCommand, CustomerResponseDto>
{
  constructor(
    private readonly _appDbContext: ApplicationDbContext,
    private readonly _validator: CreateCustomerCommandValidator,
    @inject("AddressRepository") private readonly _addressRepository: IAddressRepository,
    @inject("CustomerRepository") private readonly _customerRepository: ICustomerRepository
  ) {
    super();
  }

  public async handle(command: CreateCustomerCommand): Promise<ResultType<CustomerResponseDto>> {
    // Validating command...
    const { isFailure, exception, value } = this._validator.validate(command);
    if (isFailure) return Result.failure(exception);

    // Check if account number already exists
    if (
      !(await this._customerRepository.isAccountNumberUnique(value.tenant._id, value.accountNumber))
    ) {
      return Result.failure(CustomerExceptions.DuplicateAccountNumber);
    }

    // Check if BVN already exists
    if (!(await this._customerRepository.isBVNUnique(value.tenant._id, value.bvn))) {
      return Result.failure(CustomerExceptions.DuplicateBVN);
    }

    // Check if Id number already exists
    if (!(await this._customerRepository.isIdNumberUnique(value.tenant._id, value.idNumber))) {
      return Result.failure(CustomerExceptions.DuplicateIdNumber);
    }

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
      value.income,
      value.accountName,
      value.accountNumber,
      value.bank
    );

    // Persist with db transaction
    const session = await this._appDbContext.startTransactionSession(value.tenant._id.toString());

    try {
      await session.withTransaction(async () => {
        await this._addressRepository.insert(value.tenant._id, address, { session });
        await this._customerRepository.insert(value.tenant._id, customer, { session });
      });
    } finally {
      await session.endSession();
    }

    return Result.success("Customer created successfully", CustomerResponseDto.from(customer));
  }
}
