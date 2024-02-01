import { ErrorResponse, ExpenseFromDb, ExpressRequest, UserFromDb } from "../types/types";
import { Response } from "express"
import { fetchPendingTagsSchema } from "../utilities/schema";
import moment from "moment";
import Expenses from "../models/expense";
import _ from "lodash";
import handleException from "../utilities/handleException";
import { ERROR_CODES } from "../utilities/constants";

const fetchPendingTags = async (req: ExpressRequest, res: Response) => {
    try {
        //Validate query
        let query = req.query;
        let validQueryParams = await fetchPendingTagsSchema.validate(query);

        let user = req.user as UserFromDb;
        if (!user.tags || user.tags.length == 0) throw new Error(ERROR_CODES.NO_TAG_FOUND);

        let tagNames: string[] = []
        for (let tag of user.tags) {
            if (tag.frequency == validQueryParams.frequency) tagNames.push(tag.name); 
        }

        //Current date
        let date = moment().format("YYYY-MM-DD");
        let expenses: ExpenseFromDb[] = [];
        if (validQueryParams.frequency == "DAILY") {
            //Fetch expenses for daily tags
            expenses = await Expenses.find({ userId: user._id, date, tag: { $in: tagNames } });
        } else {
            //Fetch monthly expenses in current month
            let startDate = moment(date).startOf("month").format("YYYY-MM-DD");
            let endDate = moment(date).endOf("month").format("YYYY-MM-DD");
            expenses = await Expenses.find({ userId: user._id, date: { $gte: startDate, $lte: endDate }, tag: { $in: tagNames } });
        }

        //Return the pending tag names
        let updatedTagNames = expenses.map(expense => expense.tag) as string[];
        let pendingTagNames = _.difference(tagNames, updatedTagNames);
        res.status(200).send({ pendingTagNames });
    } catch (exception: any) {
        let { status, errorMessage }: ErrorResponse = handleException(exception.message);
        if (status == 500) return res.status(status).send();
        else return res.status(status).send({ errorMessage });
    }
}

export default fetchPendingTags;