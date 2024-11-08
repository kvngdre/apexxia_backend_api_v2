export class Fee {
  constructor(
    public readonly name: string,
    public readonly value: number,
    public readonly type: FeeTypeEnum
  ) {}
}

export enum FeeTypeEnum {
  DECIMAL = "decimal",
  PERCENTAGE = "percentage"
}
