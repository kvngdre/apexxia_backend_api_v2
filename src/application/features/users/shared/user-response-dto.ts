import { ResponseDtoType } from "@application/shared/response-dto-type";
import { User, UserStatus } from "@domain/user";

export class UserResponseDto {
  private constructor(
    public readonly userId: string,
    public readonly lenderId: string,
    public readonly avatar: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly fullName: string,
    public readonly displayName: string,
    public readonly jobTitle: string | null,
    public readonly email: string,
    public readonly isEmailVerified: boolean,
    public readonly status: UserStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from<T extends User | null>(user?: T): ResponseDtoType<T, UserResponseDto> {
    return (
      !user
        ? null
        : new UserResponseDto(
            user._id.toString(),
            user.lenderId.toString(),
            user.avatar,
            user.firstName,
            user.lastName,
            user.fullName,
            user.displayName,
            user.jobTitle,
            user.email,
            user.isEmailVerified,
            user.status,
            // user.role,
            user.createdAt,
            user.updatedAt
          )
    ) as ResponseDtoType<T, UserResponseDto>;
  }

  public static fromMany(users: User[]) {
    return users.map((u) => UserResponseDto.from(u));
  }
}
