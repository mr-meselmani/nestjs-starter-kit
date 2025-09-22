import { ENV_VARS } from '../_config/constants';

/**
 * Validates environment variables
 * @param config - The configuration object to validate
 * @returns The validated configuration object
 * @throws Error if validation fails
 */
export function validateEnvironment(
  config: Record<string, any>,
): Record<string, any> {
  // Validate required environment variables
  const missingVars = ENV_VARS.filter((key) => !config[key]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`,
    );
  }

  // Validate NODE_ENV
  const validEnvs = ['development', 'production', 'test'];
  if (!validEnvs.includes(config.NODE_ENV)) {
    throw new Error(
      `Invalid NODE_ENV: ${config.NODE_ENV}. Must be one of: ${validEnvs.join(', ')}`,
    );
  }

  return config;
}
