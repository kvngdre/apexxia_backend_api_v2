import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { GetTenantsQuery } from "./get-tenants-query";
import { Result, ResultType } from "@shared-kernel/result";
import { TenantResponseDto } from "../../shared";
import { ITenantRepository } from "@domain/tenant";

@scoped(Lifecycle.ResolutionScoped)
export class GetTenantsQueryHandler
  implements IRequestHandler<GetTenantsQuery, TenantResponseDto[]>
{
  constructor(@inject("TenantRepository") private readonly _tenantRepository: ITenantRepository) {}

  public async handle(query: GetTenantsQuery): Promise<ResultType<TenantResponseDto[]>> {
    const tenants = await this._tenantRepository.find();

    return Result.success("Tenants retrieved", TenantResponseDto.fromMany(tenants));
  }
}
