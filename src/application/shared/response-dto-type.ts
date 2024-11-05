export type ResponseDtoType<T, DtoType> = T extends null ? null : DtoType;
