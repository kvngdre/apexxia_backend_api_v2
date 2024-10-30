export interface IPublisher<T> {
  publish(data: T): Promise<void>;
}
