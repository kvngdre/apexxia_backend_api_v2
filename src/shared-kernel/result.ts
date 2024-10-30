import { Exception } from "./exception";

export class Result<TValue> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _message?: string,
    private readonly _value?: TValue,
    private readonly _exception?: Exception
  ) {}

  public get isSuccess(): boolean {
    return this._isSuccess;
  }

  public get isFailure() {
    return !this._isSuccess;
  }

  public get message() {
    if (this.isFailure) {
      throw new Error("Cannot get message of a failure result");
    }

    return this._message;
  }

  public get value() {
    if (this.isFailure) {
      throw new Error("Cannot get data of a failure result");
    }

    return this._value;
  }

  public get exception() {
    if (this.isSuccess) {
      throw new Error("Cannot get exception of a success result");
    }

    return this._exception;
  }

  public static success<TValue = undefined>(message: string, value?: TValue) {
    return new Result(true, message, value) as unknown as ISuccessResult<TValue>;
  }

  public static failure(exception: Exception) {
    return new Result<never>(false, undefined, undefined, exception) as unknown as IFailureResult;
  }
}

// const res = new Result(true, "", undefined, undefined as never);
// const res = Result.success("", 2);

export type ResultType<TValue = undefined> = ISuccessResult<TValue> | IFailureResult;

interface ISuccessResult<TValue> {
  get isSuccess(): true;
  get isFailure(): false;
  get message(): string;
  get value(): TValue | undefined | never;
  get exception(): never;
}

interface IFailureResult {
  get isSuccess(): false;
  get isFailure(): true;
  get message(): never;
  get value(): never;
  get exception(): Exception;
}
