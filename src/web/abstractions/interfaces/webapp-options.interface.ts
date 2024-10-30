export interface IWebAppOptions {
  port: number | string;
  cors?: {
    allowedOrigins: string | string[];
    methods: string | string[];
    allowedHeaders: string | string[];
  };
}
