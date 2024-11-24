import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { DeleteTenantCommand } from "./delete-tenant-command";
import { Result, ResultType } from "@shared-kernel/result";
import { ITenantRepository, TenantExceptions } from "@domain/tenant";

@scoped(Lifecycle.ResolutionScoped)
export class DeleteTenantCommandHandler implements IRequestHandler<DeleteTenantCommand> {
  constructor(@inject("TenantRepository") private readonly _tenantRepository: ITenantRepository) {}

  public async handle(command: DeleteTenantCommand): Promise<ResultType<unknown>> {
    const tenant = await this._tenantRepository.findById(command.tenantId);

    if (!tenant) return Result.failure(TenantExceptions.NotFound);

    await this._tenantRepository.delete(tenant);

    return Result.success("Tenant deleted");
  }
}
