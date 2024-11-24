export class DateTimeProvider {
  public static utcNow<T extends boolean = true>(
    options: { inDateFormat?: T } = {}
  ): T extends true ? Date : number {
    options.inDateFormat ??= true as T;

    const dateTimeInUTC = new Date(new Date().toISOString());

    return (
      options.inDateFormat === true ? dateTimeInUTC : dateTimeInUTC.getTime()
    ) as T extends true ? Date : number;
  }
}
