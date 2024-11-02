// import { singleton } from "tsyringe";
// import { z } from "zod";
// import { AbstractValidator, ValidationResultType, emailRule } from "@application/shared/validation";
// import { LoginQuery } from "./login-query";

// @singleton()
// export class LoginQueryValidator extends AbstractValidator<LoginQuery> {
//   public validate(request: LoginQuery): ValidationResultType<LoginQuery> {
//     const schema = z.object({
//       lenderId: z.string(),
//       email: emailRule,
//       password: z.string().max(256)
//     });

//     const result = schema.safeParse(request);

//     return this.mapToValidationResult(result);
//   }
// }
