import { type Request, type Response } from "express";
import { Lifecycle, scoped } from "tsyringe";
import { BaseController } from "./base-controller";
import { GetLoansQuery } from "@application/features/loans/queries/get-loans";
import { CreateLoanCommand } from "@application/features/loans/commands/create-loan";
import { HttpStatus } from "@web/web-infrastructure";
import { GetLoanByIdQuery } from "@application/features/loans/queries/get-loan-by-id";

@scoped(Lifecycle.ResolutionScoped)
export class LoanController extends BaseController {
  public readonly getLoans = async (req: Request, res: Response) => {
    const query = new GetLoansQuery(req.tenant!);

    const result = await this.sender.send(query);

    const { code, payload } = this.buildHttpResponse(result, res);

    res.status(code).json(payload);
  };

  public readonly getLoanById = async (req: Request<{ loanId: string }>, res: Response) => {
    const query = new GetLoanByIdQuery(req.tenant!, req.params.loanId);

    const result = await this.sender.send(query);

    const { code, payload } = this.buildHttpResponse(result, res);

    res.status(code).json(payload);
  };

  public readonly createLoan = async (
    req: Request<object, object, CreateLoanCommand>,
    res: Response
  ) => {
    const command = new CreateLoanCommand(
      req.tenant!,
      req.authenticatedUser!,
      req.body.customerId,
      req.body.loanProductId,
      req.body.loanAmount,
      req.body.loanTenureInMonths
    );

    const result = await this.sender.send(command);

    const { code, payload } = this.buildHttpResponse(result, res, { code: HttpStatus.CREATED });

    res.status(code).json(payload);
  };

  //   public readonly deleteLoan = async (req: Request<{ loanProductId: string }>, res: Response) => {
  //     const command = new DeleteLoanCommand(req.tenant!, req.params.loanProductId);

  //     const result = await this.sender.send(command);

  //     const { code, payload } = this.buildHttpResponse(result, res, { code: HttpStatus.NO_CONTENT });

  //     res.status(code).json(payload);
  //   };
}
