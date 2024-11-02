import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { SignupCommand } from "./signup-command";
import { AuthenticationResponseDto } from "../../shared/authentication-response-dto";
import { Result, ResultType, Encryption } from "@shared-kernel/index";
import { ITenantRepository, Tenant, TenantExceptions } from "@domain/tenant";
import { ApplicationDbContext } from "@infrastructure/database";
import { ILenderRepository, Lender } from "@domain/lender";
import { IUserRepository, User } from "@domain/user";
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
    if (!(await this._tenantRepository.isEmailUnique(command.email))) {
      return Result.failure(TenantExceptions.DuplicateEmail);
    }

    if (!(await this._tenantRepository.isSubdomainUnique(command.subdomain))) {
      return Result.failure(TenantExceptions.DuplicateEmail);
    }

    // Simulating provisioning database and creating tenant...
    const subdomain = command.subdomain.toLowerCase();
    const tenant = new Tenant(
      command.lenderName,
      subdomain,
      command.email,
      `mongodb+srv://<user>:<password>@cluster0.3wvau.mongodb.net/${subdomain}_db?retryWrites=true&w=majority`
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
      "Signup successful! Temporary password sent to email.",
      AuthenticationResponseDto.from(user, tenant)
    );
  }
}
