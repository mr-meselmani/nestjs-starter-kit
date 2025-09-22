import { registerAs } from '@nestjs/config';
import { CONFIG_NAME_SPACED, NODE_ENV_MODES } from './types';
import { developmentModeEnv } from './development';
import { productionModeEnv } from './production';
import { Logger } from '@nestjs/common';

let envConfigBasedOnMode = developmentModeEnv;

Logger.warn(
  process.env.NODE_ENV,
  '🚀 ~ file: src/config/index.ts ~ process.env.NODE_ENV:',
);

switch (process.env.NODE_ENV) {
  case NODE_ENV_MODES.DEVELOPMENT:
    envConfigBasedOnMode = developmentModeEnv;
    break;

  case NODE_ENV_MODES.PRODUCTION:
    envConfigBasedOnMode = productionModeEnv;
    break;

  default:
    envConfigBasedOnMode = developmentModeEnv;
    break;
}

export const nameSpacedAppConfig = registerAs(
  CONFIG_NAME_SPACED.APP_ENV,
  envConfigBasedOnMode.app,
);

export const nameSpacedJwtAndPassportConfig = registerAs(
  CONFIG_NAME_SPACED.JWT_AND_PASSPORT,
  envConfigBasedOnMode.jwtAndPassport,
);


export const nameSpacedDatabaseConfig = registerAs(
  CONFIG_NAME_SPACED.DATABASE,
  envConfigBasedOnMode.database,
);

export const nameSpacedEmailConfig = registerAs(
  CONFIG_NAME_SPACED.EMAIL,
  envConfigBasedOnMode.email,
);

// Export constants for use in other modules
export * from './constants';
