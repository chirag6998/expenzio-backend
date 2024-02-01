import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/users";
import { DecodedToken, ErrorResponse, ExpressRequest, UserFromDb } from "../types/types";
import { isLoggingEnabled } from "../utilities/utilities";
import handleException from "../utilities/handleException";

const JWT_KEY = process.env.JWT_KEY || "";

const validateToken = async (req: ExpressRequest, res: Response, next: NextFunction) => {
    try {
        //Fetch token
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) return res.status(401).send("Unauthorized");
        else {
            //Decode token
            const decodedToken = jwt.verify(token, JWT_KEY) as DecodedToken
            //Find User
            const user: UserFromDb | null = await User.findOne({ _id: decodedToken.id })

            if (!user) return res.status(401).send("Unauthorized");
            else {
                if (isLoggingEnabled()) console.log(`User: ${JSON.stringify(user, null, 4)}`);
                //Add user to request
                req.user = user;
            }
            if (isLoggingEnabled()) console.log("Token validated successfully");
            //Invoke next middleware
            next();
        }
    } catch (exception: any) {
        let { status, errorMessage }: ErrorResponse = handleException(exception.message);
        if (status == 500) return res.status(status).send();
        else return res.status(status).send({ errorMessage });
    }
}

export default validateToken;