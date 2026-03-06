import { API_BASE_URL, PLATFORM_ENDPOINT } from "../constants";

/**
 * App configuration
 * This could be expanded to use environment variables (import.meta.env)
 */
export const config = {
  apiUrl: API_BASE_URL,
  platformApi: `${API_BASE_URL}${PLATFORM_ENDPOINT}`,
  isDev: import.meta.env.DEV,
};

export default config;
