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
      REDIS_HOST: string;
      REDIS_PORT: string;
      REDIS_PASSWORD: string;
    }
  }
}

export {}
