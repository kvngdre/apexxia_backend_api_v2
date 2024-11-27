export class Utils {
  static generateRandomPassword(
    length: number = 6,
    options: { includeNumbers?: boolean; includeSymbols?: boolean; uppercase?: boolean } = {
      includeNumbers: true,
      includeSymbols: true,
      uppercase: true
    }
  ) {
    if (length < 4) {
      throw new Error("Invalid operation: password length must be greater than or equal to 4.");
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

  public static omitUndefinedFields(unparsedData: object): object {
    // Create a shallow copy of the input object
    const data: { [key: string]: unknown } = unparsedData as { [key: string]: unknown };

    const keys = Object.keys(data);

    for (const key of keys) {
      if (
        data[key] &&
        typeof data[key] === "object" &&
        data[key] !== null &&
        Object.prototype.toString.call(data[key]) === "[object Object]"
      ) {
        // If the value is an object, recurse into it
        Utils.omitUndefinedFields(data[key] as { [key: string]: object });

        // If the result after recurse is an empty object, delete the field
        if (Object.keys(data[key]).length === 0) {
          delete data[key];
        }
      }

      if (typeof data[key] === "undefined") {
        delete data[key];
      }
    }

    return data;
  }

  public static omitFields<T>(obj: object, ...fields: string[]) {
    const data: { [key: string]: unknown } = Object.assign(obj) as { [key: string]: unknown };

    for (const field of fields) {
      delete data[field];
    }

    return data as T;
  }
}
