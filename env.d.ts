declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_PORT: string;
      API_BASE_URL: string;
      CENTRAL_DB_URI: string;
      DB_USER: string;
      DB_PASSWORD: string;
      GOOGLE_PROJECT_ID: string;
      GOOGLE_SM_PARENT: string;
      JWT_ISSUER: string;
      JWT_AUDIENCE: string;
      JWT_SECRET_KEY: string;
      JWT_EXPIRATION_IN_MS: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
      REDIS_PASSWORD: string;
    }
  }
}

export {}
