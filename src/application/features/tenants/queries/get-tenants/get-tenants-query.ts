import { IRequest } from "@infrastructure/mediator";
import { TenantResponseDto } from "../../shared";

export class GetTenantsQuery implements IRequest<TenantResponseDto[]> {}
