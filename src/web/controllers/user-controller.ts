import { type Request, type Response } from "express";
import { Lifecycle, scoped } from "tsyringe";
import { BaseController } from "./base-controller";
import { GetAuthenticatedUserQuery } from "@application/features/users/queries/get-authenticated-user";
import { GetUserByIdQuery } from "@application/features/users/queries/get-user-by-id";
import { GetUsersQuery } from "@application/features/users/queries/get-users";
import { CreateUserCommand } from "@application/features/users/commands/create-user";
import { HttpStatus } from "@web/web-infrastructure";
import { UpdateUserCommand } from "@application/features/users/commands/update-user";

@scoped(Lifecycle.ResolutionScoped)
export class UserController extends BaseController {
  public getAuthenticatedUser = async (req: Request, res: Response) => {
    const query = new GetAuthenticatedUserQuery(req.tenant!, req.authenticatedUser!);

    const result = await this.sender.send(query);

    const { code, payload } = this.buildHttpResponse(result, res);

    res.status(code).json(payload);
  };

  public getUsers = async (req: Request, res: Response) => {
    const query = new GetUsersQuery(req.tenant!);

    const result = await this.sender.send(query);

    const { code, payload } = this.buildHttpResponse(result, res);

    res.status(code).json(payload);
  };

  public getUser = async (req: Request<{ userId: string }>, res: Response) => {
    const query = new GetUserByIdQuery(req.tenant!, req.params.userId);

    const result = await this.sender.send(query);

    const { code, payload } = this.buildHttpResponse(result, res);

    res.status(code).json(payload);
  };

  public createUser = async (req: Request<object, object, CreateUserCommand>, res: Response) => {
    const command = new CreateUserCommand(
      req.tenant!,
      req.authenticatedUser!.lenderId.toString(),
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.jobTitle
    );

    const result = await this.sender.send(command);

    const { code, payload } = this.buildHttpResponse(result, res, { code: HttpStatus.CREATED });

    res.status(code).json(payload);
  };

  public updateUser = async (
    req: Request<{ userId: string }, object, UpdateUserCommand>,
    res: Response
  ) => {
    const command = new UpdateUserCommand(
      req.tenant!,
      req.authenticatedUser!,
      req.params.userId,
      req.body.firstName,
      req.body.middleName,
      req.body.lastName,
      req.body.jobTitle
    );

    const result = await this.sender.send(command);

    const { code, payload } = this.buildHttpResponse(result, res);

    res.status(code).json(payload);
  };
}
