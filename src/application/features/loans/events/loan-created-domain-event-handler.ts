import { inject, singleton } from "tsyringe";
import { AuditTrail, IAuditTrailRepository } from "@domain/audit-trail";
import { LoanCreatedDomainEvent } from "@domain/loan/domain-events";
import { IDomainEventHandler } from "@infrastructure/pubsub/domain-event-handler-interface";
import { AuditTrailAction } from "@domain/audit-trail/audit-trail-action-enum";
// import { ILoanRepository } from "@domain/loan";

@singleton()
export class LoanCreatedDomainEventHandler implements IDomainEventHandler<LoanCreatedDomainEvent> {
  constructor(
    // @inject("LoanRepository") private readonly _loanRepository: ILoanRepository,
    @inject("AuditTrailRepository") private readonly _auditTrailRepository: IAuditTrailRepository
  ) {}

  public async handle(event: LoanCreatedDomainEvent): Promise<void> {
    const auditTrail = new AuditTrail(
      event.loan._id.toString(),
      "Loan",
      AuditTrailAction.CREATED,
      event.createdBy.toString(),
      null,
      event.loan
    );

    await this._auditTrailRepository.insert(event.tenant._id, auditTrail);
  }
}
