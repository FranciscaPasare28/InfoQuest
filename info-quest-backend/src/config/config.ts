import { Config } from './config.interface';

const config: Config = {
  application: {
    name: 'InfoQuest API',
    version: '1.0',
    host: '127.0.0.1',
    port: 3000,
  },
  cors: {
    enabled: true,
  },
  security: {
    expiresIn: '2m',
    refreshIn: '7d',
  },
};

export default (): Config => config;
