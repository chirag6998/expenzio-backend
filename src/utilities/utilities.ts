const LOGGING_ENABLED = process.env.LOGGING_ENABLED || "";

export function isLoggingEnabled() {
    return LOGGING_ENABLED == "true" ? true : false;
}