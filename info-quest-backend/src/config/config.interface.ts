export interface Config {
  application: AppConfig;
  cors: CorsConfig;
  security: SecurityConfig;
}

export interface AppConfig {
  name: string;
  version: string;
  host: string;
  port: number;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
}
