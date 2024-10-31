export class AuthUtils {
  static generateRandomPassword(
    length: number = 6,
    options: { includeNumbers?: boolean; includeSymbols?: boolean; uppercase?: boolean } = {
      includeNumbers: true,
      includeSymbols: true,
      uppercase: true
    }
  ) {
    if (length < 3) {
      throw new Error("Invalid operation: password length must be greater than or equal to 3.");
    }

    const letters = "abcdefghjkmnopqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ";
    const numbers = "123456789";
    const symbols = "@+#%&?!$";

    let characterPool = letters;
    if (options.includeNumbers) characterPool += numbers;
    if (options.includeSymbols) characterPool += symbols;
    const characterPoolLength = characterPool.length;

    let password = "";

    // Ensure at least one number if includeNumbers is true
    if (options.includeNumbers) {
      password += numbers[this.generateRandomNumber(0, numbers.length - 1)];
    }

    // Ensure at least one symbol if includeSymbols is true
    if (options.includeSymbols) {
      password += symbols[this.generateRandomNumber(0, symbols.length - 1)];
    }

    for (let i = 0; i < length - 2; i++) {
      const randomIndex = this.generateRandomNumber(0, characterPoolLength);
      password += characterPool[randomIndex];
    }

    password = this.shuffleString(password);

    return options.uppercase ? password.toUpperCase() : password;
  }

  public static generateRandomNumber(min: number = 0, max: number = 100) {
    return Math.floor(Math.random() * (max - min) + 1) + min;
  }

  // Helper to shuffle a string (Fisher-Yates algorithm)
  private static shuffleString(str: string): string {
    const array = str.split("");

    for (let i = array.length - 1; i > 0; i--) {
      const j = this.generateRandomNumber(0, i);

      [array[i], array[j]] = [array[j]!, array[i]!];
    }
    return array.join("");
  }
}
