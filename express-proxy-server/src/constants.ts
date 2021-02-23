import { config } from "dotenv";
config();

export const KEY_PATH = getEnvValue("KEY_PATH");
export const CERT_PATH = getEnvValue("CERT_PATH");
export const HTTP_PORT = getEnvValue("HTTP_PORT");
export const HTTPS_PORT = getEnvValue("HTTPS_PORT");

export const AUTH_SERVICE_URL = getEnvValue("AUTH_SERVICE_URL");
export const SCHEDULER_URL = getEnvValue("SCHEDULER_URL");

function getEnvValue(key: string) {
  if (
    process.env.NODE_ENV?.includes("dev") &&
    (key.includes("PORT") || key.includes("HOST") || key.includes("URL"))
  ) {
    key += "_LOCAL";
  }
  const value = process.env[key];
  if (!value) {
    throw `cannot parse ${key}`;
  }
  return value;
}
