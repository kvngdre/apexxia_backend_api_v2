import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { GetLenderByIdQuery } from "./get-lender-by-id-query";
import { LenderResponseDto } from "../../shared";
import { Result, ResultType } from "@shared-kernel/result";
import { ILenderRepository, LenderExceptions } from "@domain/lender";

@scoped(Lifecycle.ResolutionScoped)
export class GetLenderByIdQueryHandler
  implements IRequestHandler<GetLenderByIdQuery, LenderResponseDto>
{
  constructor(@inject("LenderRepository") private readonly _lenderRepository: ILenderRepository) {}

  public async handle(query: GetLenderByIdQuery): Promise<ResultType<LenderResponseDto>> {
    const lender = await this._lenderRepository.findById(query.tenant.id, query.lenderId);
    if (!lender) return Result.failure(LenderExceptions.NotFound);

    return Result.success("Lender retrieved successfully", LenderResponseDto.from(lender));
  }
}
