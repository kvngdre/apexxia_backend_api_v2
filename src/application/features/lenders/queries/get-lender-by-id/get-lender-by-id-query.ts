import { IRequest } from "@infrastructure/mediator";
import { LenderResponseDto } from "../../shared";
import { Tenant } from "@domain/tenant";

export class GetLenderByIdQuery implements IRequest<LenderResponseDto> {
  constructor(
    public readonly tenant: Tenant,
    public readonly lenderId: string
  ) {}
}
