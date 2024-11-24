import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { GetCustomersQuery } from "./get-customers-query";
import { CustomerResponseDto } from "../../shared/customer-response-dto";
import { Result, ResultType } from "@shared-kernel/result";
import { ICustomerRepository } from "@domain/customer";

@scoped(Lifecycle.ResolutionScoped)
export class GetCustomersQueryHandler
  implements IRequestHandler<GetCustomersQuery, CustomerResponseDto[]>
{
  constructor(
    @inject("CustomerRepository") private readonly _customerRepository: ICustomerRepository
  ) {}

  public async handle(query: GetCustomersQuery): Promise<ResultType<CustomerResponseDto[]>> {
    const customers = await this._customerRepository.find(query.tenant._id);

    return Result.success("Customers retrieved", CustomerResponseDto.fromMany(customers));
  }
}
