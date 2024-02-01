import { ErrorResponse, ExpressRequest } from "../types/types";
import { Response } from "express";
import { signInSchema } from "../utilities/schema";
import { isLoggingEnabled } from "../utilities/utilities";
import User from "../models/users";
import { ERROR_CODES } from "../utilities/constants";
import jwt from "jsonwebtoken";
import handleException from "../utilities/handleException";

const JWT_KEY = process.env.JWT_KEY || "";

const signIn = async (req: ExpressRequest, res: Response) => {

    try {
        let body = req.body;

        //Validate request body
        let validRequestBody = await signInSchema.validate(body);
        if (isLoggingEnabled()) console.log("Request body validated successfully");

        //Find user
        let user = await User.findOne({ userName: validRequestBody.userName, password: validRequestBody.password });

        //If user not found send 400
        if (!user) throw new Error(ERROR_CODES.INVALID_CREDENTIALS);
        else {
            //Generate token and return
            let token = jwt.sign({ id: user.id }, JWT_KEY, { expiresIn: '7d' });
            return res.status(200).send({ token });
        }
    } catch (exception: any) {
        let { status, errorMessage }: ErrorResponse = handleException(exception.message);
        if (status == 500) return res.status(status).send();
        else return res.status(status).send({ errorMessage });
    }
}

export default signIn;