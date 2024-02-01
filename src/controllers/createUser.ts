import { Request, Response } from "express";
import { UserType, userSchema } from "../utilities/schema";
import User from "../models/users";
import { isLoggingEnabled } from "../utilities/utilities";
import { ERROR_CODES } from "../utilities/constants";
import jwt from "jsonwebtoken";
import handleException from "../utilities/handleException";
import { ErrorResponse } from "../types/types";

let JWT_KEY = process.env.JWT_KEY || "";

const createUser = async (req: Request, res: Response) => {

    try {
        let body = req.body;
        //validate request body
        let validRequestBody: UserType = await userSchema.validate(body);

        if (isLoggingEnabled()) console.log("Request body validated successfully");

        //Fetch existing user
        let existingUser = await User.findOne({ $or: [{ userName: req.body.userName }, { phone: req.body.phone }, { email: req.body.email }] });

        if (isLoggingEnabled()) console.log("Existing user fetched successfully");

        if (existingUser) throw new Error(ERROR_CODES.USER_EXISTS);

        //Save user
        let user = new User(validRequestBody);
        let response = await user.save();

        if (isLoggingEnabled()) console.log("User saved successfully");

        //Generate token
        let id = response._id;
        let token = jwt.sign({ userName: response.userName, id }, JWT_KEY, { expiresIn: '7d' });

        if (isLoggingEnabled()) console.log("Token updated to database successfully");

        //Send response
        return res.status(200).send({ token });
    } catch (exception: any) {
        let { status, errorMessage }: ErrorResponse = handleException(exception.message);
        if (status == 500) return res.status(status).send();
        else return res.status(status).send({ errorMessage });
    }
}

export default createUser;