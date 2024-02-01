import { ErrorResponse, ExpressRequest, UserFromDb } from "../types/types";
import { Response } from "express";
import { addTagsSchema } from "../utilities/schema";
import { isLoggingEnabled } from "../utilities/utilities";
import User from "../models/users";
import handleException from "../utilities/handleException";

const addTags = async (req: ExpressRequest, res: Response) => {

    try {
        let body = req.body;
        //Validate request body
        let validRequestBody = await addTagsSchema.validate(body);
        if (isLoggingEnabled()) console.log("Request body validated successfully");
        //Update query
        let user = req.user as UserFromDb;
        let updateQuery = { $push: { tags: { $each: validRequestBody.tags } } };
        //Update tags
        await User.updateOne({ _id: user._id }, updateQuery);
        //Return response
        return res.status(200).send();
    } catch (exception: any) {
        let { status, errorMessage }: ErrorResponse = handleException(exception.message);
        if (status == 500) return res.status(status).send();
        else return res.status(status).send({ errorMessage });
    }
}

export default addTags;