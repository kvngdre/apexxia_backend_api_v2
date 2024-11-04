import { type Request, type Response, type NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { AbstractMiddleware } from "@web/abstractions/types";
import { IJwtService } from "@application/abstractions/services";
import { IUserRepository } from "@domain/user";
import { ISessionRepository } from "@domain/session";
import { AuthenticationExceptions } from "@application/features/auth/shared";
import { ApiResponse, HttpStatus } from "@web/web-infrastructure";

@injectable()
export class AuthenticationMiddleware extends AbstractMiddleware {
  private readonly _jwtService: IJwtService;
  private readonly _userRepository: IUserRepository;
  private readonly _sessionRepository: ISessionRepository;

  constructor(
    @inject("JwtService") jwtService: IJwtService,
    @inject("UserRepository") userRepository: IUserRepository,
    @inject("SessionRepository") sessionRepository: ISessionRepository
  ) {
    super();
    this._jwtService = jwtService;
    this._userRepository = userRepository;
    this._sessionRepository = sessionRepository;
  }

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authToken = req.cookies?.jwt || req.headers.authorization;

    if (!authToken) {
      const exception = AuthenticationExceptions.MissingAuthorizationToken;
      const code = HttpStatus.mapExceptionToHttpStatus(exception);

      res.status(code).json(ApiResponse.failure(exception, res));
      return;
    }

    const [scheme, token] = authToken.split(" ");

    if (scheme?.toLowerCase() !== "bearer") {
      const exception = AuthenticationExceptions.UnsupportedAuthorizationScheme;
      const code = HttpStatus.mapExceptionToHttpStatus(exception);

      res.status(code).json(ApiResponse.failure(exception, res));
      return;
    }

    if (!token) {
      const exception = AuthenticationExceptions.MissingOrMalformedAuthToken;
      const code = HttpStatus.mapExceptionToHttpStatus(exception);

      res.status(code).json(ApiResponse.failure(exception, res));
      return;
    }

    const decoded = this._jwtService.decodeToken(token);

    if (decoded === null) {
      const exception = AuthenticationExceptions.InvalidOrExpiredToken;
      const code = HttpStatus.mapExceptionToHttpStatus(exception);

      res.status(code).json(ApiResponse.failure(exception, res));
      return;
    }

    const [user, session] = await Promise.all([
      this._userRepository.findById(decoded.tenantId as string, decoded.sub as string),
      this._sessionRepository.findByUserId(decoded.tenantId as string, decoded.sub as string)
    ]);

    if (!session) {
      const exception = AuthenticationExceptions.SessionExpired;
      const code = HttpStatus.mapExceptionToHttpStatus(exception);

      res.status(code).json(ApiResponse.failure(exception, res));
      return;
    }

    if (!user) {
      const exception = AuthenticationExceptions.InvalidOrExpiredToken;
      const code = HttpStatus.mapExceptionToHttpStatus(exception);

      res.status(code).json(ApiResponse.failure(exception, res));
      return;
    }

    req.authenticatedUser = user;

    return next();
  }
}
