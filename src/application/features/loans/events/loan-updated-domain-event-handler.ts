import { inject, singleton } from "tsyringe";
import { isEqual } from "lodash";
import { AuditTrail, IAuditTrailRepository } from "@domain/audit-trail";
import { LoanUpdatedDomainEvent } from "@domain/loan/domain-events";
import { IDomainEventHandler } from "@infrastructure/pubsub/domain-event-handler-interface";
import { AuditTrailAction } from "@domain/audit-trail/audit-trail-action-enum";

@singleton()
export class LoanUpdatedDomainEventHandler implements IDomainEventHandler<LoanUpdatedDomainEvent> {
  constructor(
    @inject("AuditTrailRepository") private readonly _auditTrailRepository: IAuditTrailRepository
  ) {}

  public async handle(event: LoanUpdatedDomainEvent): Promise<void> {
    if (isEqual(event.oldData, event.newData)) return;

    const auditTrail = new AuditTrail(
      event.oldData._id.toString(),
      "Loan",
      AuditTrailAction.UPDATED,
      event.updatedBy.toString(),
      event.oldData,
      event.newData
    );

    await this._auditTrailRepository.insert(event.tenantId, auditTrail);
  }
}
