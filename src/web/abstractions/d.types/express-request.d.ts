import { Tenant } from "@domain/tenant";
import { HydratedUserDocument } from "@domain/user";

declare global {
  namespace Express {
    export interface Request {
      authenticatedUser?: HydratedUserDocument;
      tenantId?: string;
      tenant?: Tenant;
    }
  }
}
