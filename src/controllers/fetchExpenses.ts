import { Response } from "express";
import { fetchExpensesSchema } from "../utilities/schema";
import { isLoggingEnabled } from "../utilities/utilities";
import { ErrorResponse, ExpressRequest, UserFromDb } from "../types/types";
import Expenses from "../models/expense";
import handleException from "../utilities/handleException";

const fetchExpenses = async (req: ExpressRequest, res: Response) => {

    try {
        let queryParams = req.query;

        let validQueryParams = await fetchExpensesSchema.validate(queryParams);
        if (isLoggingEnabled()) console.log("Request body validated successfully");

        let user = req.user as UserFromDb;

        const dateQuery = {
            date: {
                $gte: validQueryParams.startDate,
                $lte: validQueryParams.endDate
            }
        }

        const userQuery = { userId: user._id }
        const tagQuery = validQueryParams.tag ? { tag: validQueryParams.tag } : {};
        const query = { $and: [userQuery, dateQuery, tagQuery] };

        const pipeline = [
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    expenses: { $push: "$$ROOT" }
                }
            }
        ]

        const result = await Expenses.aggregate(pipeline);
        const apiResponse = result.length == 0 ? { totalAmount: 0, expenses: [] } : { totalAmount: result[0].totalAmount, expenses: result[0].expenses };
        res.status(200).send(apiResponse);
    } catch (exception: any) {
        let { status, errorMessage }: ErrorResponse = handleException(exception.message);
        if (status == 500) return res.status(status).send();
        else return res.status(status).send({ errorMessage });
    }
}

export default fetchExpenses;