import { ResponseDtoType } from "@application/shared/response-dto-type";
import { Session } from "@domain/session";
import { User } from "@domain/user";

export class SessionResponseDto {
  private constructor(
    public readonly sessionId: string,
    public readonly userId: string,
    public readonly lastLoginDateTime: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly user?: User
  ) {}

  public static from<T extends Session | null>(
    session?: T
  ): ResponseDtoType<T, SessionResponseDto> {
    return (
      !session
        ? null
        : new SessionResponseDto(
            session._id.toString(),
            session.userId.toString(),
            session.lastLoginDateTime,
            session.createdAt,
            session.updatedAt,
            session.user
          )
    ) as ResponseDtoType<T, SessionResponseDto>;
  }

  public static fromMany(sessions: Session[]) {
    return sessions.map((s) => SessionResponseDto.from(s));
  }
}
