import { ErrorResponse } from "../types/types";
import { ERROR_CODES } from "./constants";
import { isLoggingEnabled } from "./utilities";

function handleException(errorMessage: string): ErrorResponse {

    if (isLoggingEnabled()) console.log(`Error: ${errorMessage}`);

    if (Object.values(ERROR_CODES).includes(errorMessage)) {
        return {
            status: 400,
            errorMessage
        }
    } else if(errorMessage == "jwt expired") {
        return {
            status: 401
        }
    } else {
        return {
            status: 500
        }
    }
}

export default handleException;