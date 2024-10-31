import { container, Lifecycle } from "tsyringe";
import { SignupCommandHandler } from "./features/auth/commands/signup";

export function registerApplicationServices() {
  container.register("SignupCommandHandler", SignupCommandHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });
}
