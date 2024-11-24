import { type Request, type Response, type NextFunction } from "express";
import { inject, singleton } from "tsyringe";
import { AbstractMiddleware } from "@web/abstractions/types";
import { ITenantRepository, Tenant } from "@domain/tenant";
import { RedisService } from "@infrastructure/services";
import { Exception } from "@shared-kernel/exception";
import { ApiResponse } from "@web/web-infrastructure";
import { ResourceNotFoundMiddleware } from "./resource-not-found-middleware";

@singleton()
export class ResolveTenantMiddleware extends AbstractMiddleware {
  constructor(
    private readonly _redisService: RedisService,
    @inject("TenantRepository") private readonly _tenantRepository: ITenantRepository,
    private readonly _r: ResourceNotFoundMiddleware
  ) {
    super();
  }

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const host = req.headers.host || "";
      const subdomain: string = host.split(".")[0]!;

      if (!subdomain) {
        // TODO: test this !!
        return this._r.execute(req, res, next);
      }

      // Check redis cache
      let tenant: string | Tenant | null = await this._redisService.get(
        `tenant:subdomain:${subdomain}`
      );

      if (!tenant) {
        tenant = await this._tenantRepository.findBySubdomain(subdomain);

        if (!tenant) {
          const exception = Exception.NotFound("General.TenantNotFound", "Unknown tenant");
          res.status(404).json(ApiResponse.failure(exception, res));
          return;
        }

        await this._redisService.set(
          `tenant:subdomain:${subdomain}`,
          JSON.stringify(tenant),
          86400 // 1 day in seconds
        );

        await this._redisService.set(
          `tenant:${tenant._id.toString()}`,
          JSON.stringify(tenant),
          86400 // 1 day in seconds
        );
      }

      // Populate tenant information on the request object
      req.tenant = JSON.parse(tenant as string) as Tenant;

      next();
    } catch (error) {
      next(error);
    }
  }
}
