export interface IGoogleSecretManagerService {
  addSecret(
    secretId: string,
    value: string
  ): Promise<{
    secretName: string;
    versionName: string;
  }>;
  getSecret(versionName: string): Promise<string | null>;
  updateSecret(secretName: string, secretId: string, value: string): Promise<string>;
  deleteSecret(secretName: string): Promise<void>;
}
