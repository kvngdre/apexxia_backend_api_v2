export interface IDateTimeProvider {
  utcNow<T extends boolean = true>(options?: { inDateFormat?: T }): T extends true ? Date : number;
}
