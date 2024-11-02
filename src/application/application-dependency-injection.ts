import { container, Lifecycle } from "tsyringe";
import { SignupCommandHandler } from "./features/auth/commands/signup";
import { ResendTempPasswordCommandHandler } from "./features/auth/commands/resend-temp-password";

export function registerApplicationServices() {
  container.register("SignupCommandHandler", SignupCommandHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });
  container.register("ResendTempPasswordCommandHandler", ResendTempPasswordCommandHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });
}
