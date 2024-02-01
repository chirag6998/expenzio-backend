import { Response } from "express";
import { budgetSchema } from "../utilities/schema";
import { isLoggingEnabled } from "../utilities/utilities";
import moment from "moment";
import { ErrorResponse, ExpressRequest, UserFromDb } from "../types/types";
import handleException from "../utilities/handleException";
import Budget from "../models/budgets";

const saveBudget = async (req: ExpressRequest, res: Response) => {

    try {
        let body = req.body;
        //Validate request body
        let validRequestBody = await budgetSchema.validate(body);
        if (isLoggingEnabled()) console.log("Request body validated successfully");
        //Get current month and year
        let currentDate = moment();
        let month = currentDate.month() + 1;
        let year = currentDate.year();

        let user = req.user as UserFromDb;

        //Upsert params
        let filter = { month, year, userId: user._id }
        let updateObj = { $set: { amount: validRequestBody.amount } }
        let options = { upsert: true, new: true };

        await Budget.updateOne(filter, updateObj, options);
        //Return response
        return res.status(200).send();
    } catch (exception: any) {
        let { status, errorMessage }: ErrorResponse = handleException(exception.message);
        if (status == 500) return res.status(status);
        else return res.status(status).send({ errorMessage });
    }
}

export default saveBudget;