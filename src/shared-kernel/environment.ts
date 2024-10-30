export class Environment {
  public static get isDevelopment() {
    return process.env.NODE_ENV === "development";
  }

  public static get isProduction() {
    return process.env.NODE_ENV === "production";
  }

  public static get isTest() {
    return process.env.NODE_ENV === "test";
  }
}
