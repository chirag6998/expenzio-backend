import moment from "moment";
import { ErrorResponse, ExpressRequest, UserFromDb } from "../types/types";
import { Response } from "express";
import Budget from "../models/budgets";
import handleException from "../utilities/handleException";

const findBudget = async (req: ExpressRequest, res: Response) => {

    try {
        //Get current month and year
        let currentDate = moment();
        let month = currentDate.month() + 1;
        let year = currentDate.year();
        //Get user
        let user = req.user as UserFromDb
        //FInd budget
        let budget = await Budget.findOne({ month, year, userId: user._id });
        //Return budget
        return res.status(200).send({ amount: budget ? budget.amount : null });
    } catch (exception: any) {
        let { status, errorMessage }: ErrorResponse = handleException(exception.message);
        if (status == 500) return res.status(status);
        else return res.status(status).send({ errorMessage });
    }
}

export default findBudget;