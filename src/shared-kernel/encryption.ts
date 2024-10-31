import { hashSync, getRounds, compareSync } from "bcryptjs";

export class Encryption {
  /**
   * Encrypts the given text with an optional salt.
   */
  public static encryptText(text: string, salt: string | number = 12) {
    return hashSync(text, salt);
  }

  /**
   * Checks if the given text is encrypted.
   */
  public static isEncrypted(text: string) {
    return getRounds(text) > 0;
  }

  /**
   * Compares a plaintext text with a hash to check for a match.
   */
  public static compare(hash: string, text: string): boolean {
    try {
      return compareSync(text, hash);
    } catch (error: unknown) {
      return false;
    }
  }
}
