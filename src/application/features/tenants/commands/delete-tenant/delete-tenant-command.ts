import { IRequest } from "@infrastructure/mediator";

export class DeleteTenantCommand implements IRequest {
  constructor(public readonly tenantId: string) {}
}
