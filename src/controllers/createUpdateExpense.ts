import { ErrorResponse, ExpressRequest, UserFromDb } from "../types/types";
import { Response } from "express";
import { createExpenseSchema, updateExpenseSchema } from "../utilities/schema";
import moment from "moment";
import Expenses from "../models/expense";
import handleException from "../utilities/handleException";
import _ from "lodash";

const createUpdateExpense = async (req: ExpressRequest, res: Response) => {
    try {
        //Get params and body
        let params = req.params;
        let body = req.body;
        //Validate params and request body
        let validPathParams = await updateExpenseSchema.validate(params);
        let validRequestBody = await createExpenseSchema.validate(body);
        //If path params are empty, create a new expense
        if (_.isEmpty(validPathParams)) {
            let date = moment().format("YYYY-MM-DD");
            let user = req.user as UserFromDb;
            //Get tag name from request body
            let tagName = validRequestBody.tagName as string;
            //Create new expemse
            let expense = new Expenses({ date, userId: user._id, tag: tagName, amount: validRequestBody.amount });
            await expense.save();
        }
        //Update the amount on the existing expense
        else {
            await Expenses.updateOne({ _id: validPathParams.expenseId }, { $set: { amount: validRequestBody.amount } })
        }
        //Return 200
        res.status(200).send();
    } catch (exception: any) {
        let { status, errorMessage }: ErrorResponse = handleException(exception.message);
        if (status == 500) return res.status(status).send();
        else return res.status(status).send({ errorMessage });
    }
}

export default createUpdateExpense;