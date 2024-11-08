import { type Request, type Response } from "express";
import { Lifecycle, scoped } from "tsyringe";
import { BaseController } from "./base-controller";
import { CreateLoanProductCommand } from "@application/features/loan-products/commands/create-loan-product";
import { HttpStatus } from "@web/web-infrastructure";
import { GetLoanProductsQuery } from "@application/features/loan-products/queries/get-loan-products";
import { GetLoanProductByIdQuery } from "@application/features/loan-products/queries/get-by-id";
import { UpdateLoanProductCommand } from "@application/features/loan-products/commands/update-loan-product";
import { DeleteLoanProductCommand } from "@application/features/loan-products/commands/delete-loan-product";

@scoped(Lifecycle.ResolutionScoped)
export class LoanProductController extends BaseController {
  public readonly createLoanProduct = async (
    req: Request<object, object, CreateLoanProductCommand>,
    res: Response
  ) => {
    const { body } = req;
    const command = new CreateLoanProductCommand(
      req.tenant!,
      req.authenticatedUser!.lenderId.toString(),
      body.name,
      body.minLoanAmount,
      body.maxLoanAmount,
      body.interestRateInPercentage,
      body.isActive,
      body.upfrontFee,
      body.maxDTIInPercentage,
      body.minTenureInMonths,
      body.maxTenureInMonths,
      body.minIncome,
      body.maxIncome,
      body.minAge,
      body.maxAge,
      body.fees
    );

    const result = await this.sender.send(command);

    const { code, payload } = this.buildHttpResponse(result, res, { code: HttpStatus.CREATED });

    res.status(code).json(payload);
  };

  public readonly getLoanProducts = async (req: Request, res: Response) => {
    const query = new GetLoanProductsQuery(req.tenant!);

    const result = await this.sender.send(query);

    const { code, payload } = this.buildHttpResponse(result, res);

    res.status(code).json(payload);
  };

  public readonly getLoanProductById = async (
    req: Request<{ loanProductId: string }>,
    res: Response
  ) => {
    const query = new GetLoanProductByIdQuery(req.tenant!, req.params.loanProductId);

    const result = await this.sender.send(query);

    const { code, payload } = this.buildHttpResponse(result, res);

    res.status(code).json(payload);
  };

  public readonly updateLoanProduct = async (
    req: Request<{ loanProductId: string }, object, UpdateLoanProductCommand>,
    res: Response
  ) => {
    const { body } = req;
    const command = new UpdateLoanProductCommand(
      req.tenant!,
      req.params.loanProductId,
      body.name,
      body.minLoanAmount,
      body.maxLoanAmount,
      body.interestRateInPercentage,
      body.isActive,
      body.upfrontFee,
      body.maxDTIInPercentage,
      body.minTenureInMonths,
      body.maxTenureInMonths,
      body.minIncome,
      body.maxIncome,
      body.minAge,
      body.maxAge,
      body.fees
    );

    const result = await this.sender.send(command);

    const { code, payload } = this.buildHttpResponse(result, res);

    res.status(code).json(payload);
  };

  public readonly deleteLoanProduct = async (
    req: Request<{ loanProductId: string }>,
    res: Response
  ) => {
    const command = new DeleteLoanProductCommand(req.tenant!, req.params.loanProductId);

    const result = await this.sender.send(command);

    const { code, payload } = this.buildHttpResponse(result, res, { code: HttpStatus.NO_CONTENT });

    res.status(code).json(payload);
  };
}
