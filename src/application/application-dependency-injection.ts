import { container, Lifecycle } from "tsyringe";
import { SignupCommandHandler, SignupCommandValidator } from "./features/auth/commands/signup";
import {
  ResendTempPasswordCommandHandler,
  ResendTempPasswordCommandValidator
} from "./features/auth/commands/resend-temp-password";
import { LoginQueryHandler, LoginQueryValidator } from "./features/auth/queries/login";
import {
  ResetPasswordCommandHandler,
  ResetPasswordCommandValidator
} from "./features/auth/commands/reset-password";
import { GetAuthenticatedUserQueryHandler } from "./features/users/queries/get-authenticated-user";
import { GetLenderByIdQueryHandler } from "./features/lenders/queries/get-lender-by-id";

export function registerApplicationServices() {
  container.registerSingleton(SignupCommandValidator);
  container.register("SignupCommandHandler", SignupCommandHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });

  container.registerSingleton(LoginQueryValidator);
  container.register("LoginQueryHandler", LoginQueryHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });

  container.registerSingleton(ResendTempPasswordCommandValidator);
  container.register("ResendTempPasswordCommandHandler", ResendTempPasswordCommandHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });

  container.registerSingleton(ResetPasswordCommandValidator);
  container.register("ResetPasswordCommandHandler", ResetPasswordCommandHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });

  container.register("GetAuthenticatedUserQueryHandler", GetAuthenticatedUserQueryHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });

  container.register("GetAuthenticatedUserQueryHandler", GetLenderByIdQueryHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });
}
