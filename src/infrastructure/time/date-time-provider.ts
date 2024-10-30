import { singleton } from "tsyringe";
import { IDateTimeProvider } from "@shared-kernel/date-time-provider-interface";

@singleton()
export class DateTimeProvider implements IDateTimeProvider {
  public utcNow<T extends boolean = true>(
    options: { inDateFormat?: T } = {}
  ): T extends true ? Date : number {
    options.inDateFormat ??= true as T;

    const dateTimeInUTC = new Date(new Date().toISOString());

    return (
      options.inDateFormat === true ? dateTimeInUTC : dateTimeInUTC.getTime()
    ) as T extends true ? Date : number;
  }
}
