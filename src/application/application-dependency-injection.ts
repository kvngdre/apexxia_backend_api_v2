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
import {
  CreateLoanProductCommandHandler,
  CreateLoanProductCommandValidator
} from "./features/loan-products/commands/create-loan-product";
import { GetSessionsQueryHandler } from "./features/sessions/queries/get-sessions";
import { GetLoanProductsQueryHandler } from "./features/loan-products/queries/get-loan-products";
import { GetLoanProductByIdQueryHandler } from "./features/loan-products/queries/get-by-id";
import {
  UpdateLoanProductCommandHandler,
  UpdateLoanProductCommandValidator
} from "./features/loan-products/commands/update-loan-product";
import { DeleteLoanProductCommandHandler } from "./features/loan-products/commands/delete-loan-product";
import { GetLenderByIdQueryHandler } from "./features/lenders/queries/get-by-id";
import { GetUsersQueryHandler } from "./features/users/queries/get-users";
import { GetUserByIdQueryHandler } from "./features/users/queries/get-user-by-id";
import {
  CreateUserCommandHandler,
  CreateUserCommandValidator
} from "./features/users/commands/create-user";
import { GetTenantsQueryHandler } from "./features/tenants/queries/get-tenants";
import { DeleteTenantCommandHandler } from "./features/tenants/commands/delete-tenant";
import { GetCustomersQueryHandler } from "./features/customers/queries/get-customers";
import {
  CreateCustomerCommandHandler,
  CreateCustomerCommandValidator
} from "./features/customers/commands/create-customer";
import { DeleteCustomerCommandHandler } from "./features/customers/commands/delete-customer";

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

  container.register("GetLenderByIdQueryHandler", GetLenderByIdQueryHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });

  container.register("GetAuthenticatedUserQueryHandler", GetAuthenticatedUserQueryHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });

  container.registerSingleton(CreateLoanProductCommandValidator);
  container.register("CreateLoanProductCommandHandler", CreateLoanProductCommandHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });

  container.registerSingleton(UpdateLoanProductCommandValidator);
  container.register("UpdateLoanProductCommandHandler", UpdateLoanProductCommandHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });

  container.register("DeleteLoanProductCommandHandler", DeleteLoanProductCommandHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });

  container.register("GetLoanProductsQueryHandler", GetLoanProductsQueryHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });

  container.register("GetLoanProductByIdQueryHandler", GetLoanProductByIdQueryHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });

  container.register("GetSessionsQueryHandler", GetSessionsQueryHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });

  container.register("GetUsersQueryHandler", GetUsersQueryHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });

  container.register("GetUserByIdQueryHandler", GetUserByIdQueryHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });

  container.registerSingleton(CreateUserCommandValidator);
  container.register("CreateUserCommandHandler", CreateUserCommandHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });

  container.register("GetTenantsQueryHandler", GetTenantsQueryHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });

  container.register("DeleteTenantCommandHandler", DeleteTenantCommandHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });

  container.register("GetCustomersQueryHandler", GetCustomersQueryHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });

  container.registerSingleton(CreateCustomerCommandValidator);
  container.register("CreateCustomerCommandHandler", CreateCustomerCommandHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });

  container.register("DeleteCustomerCommandHandler", DeleteCustomerCommandHandler, {
    lifecycle: Lifecycle.ResolutionScoped
  });
}
