export interface IRedisService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  get(key: string): Promise<string | null>;
  set(key: string, value: string, expiresInSec?: number): Promise<void>;
  delete(key: string): Promise<void>;
}
