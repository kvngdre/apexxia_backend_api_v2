import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { CustomerResponseDto } from "../../shared/customer-response-dto";
import { Result, ResultType } from "@shared-kernel/result";
import { CustomerExceptions, ICustomerRepository } from "@domain/customer";
import { GetCustomerByIdQuery } from "./get-customer-by-id-query";

@scoped(Lifecycle.ResolutionScoped)
export class GetCustomerByIdQueryHandler
  implements IRequestHandler<GetCustomerByIdQuery, CustomerResponseDto>
{
  constructor(
    @inject("CustomerRepository") private readonly _customerRepository: ICustomerRepository
  ) {}

  public async handle(query: GetCustomerByIdQuery): Promise<ResultType<CustomerResponseDto>> {
    const customer = await this._customerRepository.findById(query.tenant._id, query.customerId);
    if (!customer) return Result.failure(CustomerExceptions.NotFound);

    return Result.success("Customer retrieved", CustomerResponseDto.from(customer));
  }
}
