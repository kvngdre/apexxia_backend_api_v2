import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { SignupCommand } from "./signup-command";
import { AuthenticationResponseDto } from "../../shared/authentication-response-dto";
import { Result, ResultType, Encryption, Utils } from "@shared-kernel/index";
import { ITenantRepository, Tenant, TenantExceptions } from "@domain/tenant";
import { ApplicationDbContext } from "@infrastructure/database";
import { ILenderRepository, Lender, LenderStatus } from "@domain/lender";
import { IUserRepository, User, UserStatus } from "@domain/user";
import { SignupCommandValidator } from "./signup-command-validator";

@scoped(Lifecycle.ResolutionScoped)
export class SignupCommandHandler
  implements IRequestHandler<SignupCommand, AuthenticationResponseDto>
{
  constructor(
    private readonly _appDbContext: ApplicationDbContext,
    private readonly _validator: SignupCommandValidator,
    @inject("TenantRepository") private readonly _tenantRepository: ITenantRepository,
    @inject("LenderRepository") private readonly _lenderRepository: ILenderRepository,
    @inject("UserRepository") private readonly _userRepository: IUserRepository
  ) {}

  public async handle(command: SignupCommand): Promise<ResultType<AuthenticationResponseDto>> {
    // Validating command...
    const { isFailure, exception, value } = this._validator.validate(command);
    if (isFailure) return Result.failure(exception);

    // Ensure tenant is unique
    if (!(await this._tenantRepository.isEmailUnique(value.email))) {
      return Result.failure(TenantExceptions.DuplicateEmail);
    }
    if (!(await this._tenantRepository.isSubdomainUnique(value.subdomain))) {
      return Result.failure(TenantExceptions.DuplicateSubdomain);
    }

    // create lender
    const lender = new Lender(value.lenderName, LenderStatus.ONBOARDING);

    // ! Simulating provisioning database and creating tenant...
    const subdomain = value.subdomain.toLowerCase();
    const tenant = new Tenant(
      lender._id,
      value.lenderName,
      subdomain,
      value.email,
      // TODO: update this to come from env file
      `mongodb+srv://<user>:<password>@cluster0.3wvau.mongodb.net/${subdomain}_db?retryWrites=true&w=majority`
    );

    // create user
    const temporaryPassword = Utils.generateRandomPassword(8);
    const user = new User(
      lender._id,
      value.firstName,
      value.lastName,
      value.email,
      Encryption.encryptText(temporaryPassword),
      UserStatus.ONBOARDING
    );

    // start transaction
    const session = await this._appDbContext.startTransactionSession(tenant._id.toString());

    try {
      await session.withTransaction(async () => {
        await this._tenantRepository.insert(tenant, { session });
        await this._lenderRepository.insert(tenant.id, lender, { session });
        await this._userRepository.insert(tenant.id, user, { session });

        // send verification email or raise event
        console.log("Your temporary password is: " + temporaryPassword);
      });
    } finally {
      await session.endSession();
    }

    // TODO: raise signup domain event...

    // return
    return Result.success(
      "Signup successful! Temporary password sent to email.",
      AuthenticationResponseDto.from(user, tenant)
    );
  }
}
