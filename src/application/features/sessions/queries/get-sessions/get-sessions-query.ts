import { Tenant } from "@domain/tenant";
import { IRequest } from "@infrastructure/mediator";
import { SessionResponseDto } from "../../shared/session-response-dto";

export class GetSessionsQuery implements IRequest<SessionResponseDto[]> {
  constructor(public readonly tenant: Tenant) {}
}
