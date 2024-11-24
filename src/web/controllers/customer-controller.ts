import { type Request, type Response } from "express";
import { Lifecycle, scoped } from "tsyringe";
import { BaseController } from "./base-controller";
import { GetCustomersQuery } from "@application/features/customers/queries/get-customers";
import { CreateCustomerCommand } from "@application/features/customers/commands/create-customer";
import { HttpStatus } from "@web/web-infrastructure";

@scoped(Lifecycle.ResolutionScoped)
export class CustomerController extends BaseController {
  public getCustomers = async (req: Request, res: Response) => {
    const query = new GetCustomersQuery(req.tenant!);

    const result = await this.sender.send(query);

    const { code, payload } = this.buildHttpResponse(result, res);

    res.status(code).json(payload);
  };

  public createCustomer = async (
    req: Request<object, object, CreateCustomerCommand>,
    res: Response
  ) => {
    const { body } = req;
    const command = new CreateCustomerCommand(
      req.tenant!,
      req.authenticatedUser!.lenderId.toString(),
      body.firstName,
      body.middleName,
      body.lastName,
      body.gender,
      body.dateOfBirth,
      body.residentialAddress,
      body.phone,
      body.email,
      body.maritalStatus,
      body.bvn,
      body.idType,
      body.idNumber,
      body.idExpiration,
      body.nextOfKin,
      body.accountName,
      body.accountNumber,
      body.bank
    );

    const result = await this.sender.send(command);

    const { code, payload } = this.buildHttpResponse(result, res, { code: HttpStatus.CREATED });

    res.status(code).json(payload);
  };
}
