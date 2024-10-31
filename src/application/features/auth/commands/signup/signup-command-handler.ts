import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { SignupCommand } from "./signup-command";
import { AuthenticationResponseDto } from "../../shared/authentication-response-dto";
import { Result, ResultType, Encryption } from "@shared-kernel/index";
import { ITenantRepository, Tenant } from "@domain/tenants";
import { ApplicationDbContext } from "@infrastructure/database";
import { ILenderRepository, Lender } from "@domain/lenders";
import { IUserRepository, User } from "@domain/users";
import { AuthUtils } from "../../shared/auth-utils";

@scoped(Lifecycle.ResolutionScoped)
export class SignupCommandHandler
  implements IRequestHandler<SignupCommand, AuthenticationResponseDto>
{
  constructor(
    private readonly _appDbContext: ApplicationDbContext,
    @inject("TenantRepository") private readonly _tenantRepository: ITenantRepository,
    @inject("LenderRepository") private readonly _lenderRepository: ILenderRepository,
    @inject("UserRepository") private readonly _userRepository: IUserRepository
  ) {}

  public async handle(command: SignupCommand): Promise<ResultType<AuthenticationResponseDto>> {
    // Provision database...

    // create tenant
    const tenant = new Tenant(
      command.lenderName,
      `mongodb+srv://admin-user:pspP0rB7VSaUH4aA@cluster0.3wvau.mongodb.net/${command.lenderName.replaceAll(" ", "_").toLowerCase()}_db?retryWrites=true&w=majority`
    );

    await this._tenantRepository.insert(tenant);

    // create lender
    const lender = new Lender(tenant._id, command.lenderName);

    // create user
    const temporaryPassword = AuthUtils.generateRandomPassword(8);
    const user = new User(
      lender._id,
      command.firstName,
      command.lastName,
      command.email,
      Encryption.encryptText(temporaryPassword)
    );

    // send verification email or raise event
    console.log("Your temporary password is: " + temporaryPassword);

    // save
    const session = await this._appDbContext.startTransactionSession(tenant._id.toString());

    try {
      await session.withTransaction(async () => {
        // await this._tenantRepository.insert(tenant, { session });
        await this._lenderRepository.insert(tenant.id, lender, { session });
        await this._userRepository.insert(tenant.id, user, { session });
      });
    } finally {
      await session.endSession();
    }

    // return
    return Result.success(
      "Registration successful, please check email to continue with registration",
      AuthenticationResponseDto.from(user, tenant._id)
    );
  }
}
