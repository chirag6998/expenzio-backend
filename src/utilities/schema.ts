import { InferType, array, number, object, string } from "yup";
import { ERROR_CODES, FREQUENCY } from "./constants";

export const TagSchema = object({
    frequency: string().required().oneOf(FREQUENCY, ERROR_CODES.INVALID_FREQUENCY).typeError(ERROR_CODES.INVALID_FREQUENCY),
    name: string().required().typeError(ERROR_CODES.INVALID_TAG_NAME)
})

export const userSchema = object({
    userName: string().required().typeError(ERROR_CODES.INVALID_USERNAME),
    phone: string().max(10).min(10).required().typeError(ERROR_CODES.INVALID_PHONE),
    email: string().email().required().typeError(ERROR_CODES.INVALID_EMAIL),
    password: string().required().typeError(ERROR_CODES.INVALID_PASSWORD),
    tags: array(TagSchema)
})

export const budgetSchema = object({
    amount: number().required().typeError(ERROR_CODES.AMOUNT_IS_REQUIRED)
})

export const signInSchema = object({
    userName: string().required().typeError(ERROR_CODES.INVALID_USERNAME),
    password: string().required().typeError(ERROR_CODES.INVALID_PASSWORD)
})

export const addTagsSchema = object({
    tags: array(TagSchema.typeError(ERROR_CODES.INVALID_TAGS)).required().typeError(ERROR_CODES.INVALID_TAGS)
})

export const fetchPendingTagsSchema = object({
    frequency: string().required().oneOf(FREQUENCY, ERROR_CODES.INVALID_FREQUENCY).typeError(ERROR_CODES.INVALID_FREQUENCY)
})

export const updateExpenseSchema = object({
    expenseId: string().typeError(ERROR_CODES.INVALID_EXPENSE_ID)
})

export const createExpenseSchema = object({
    tagName: string().nullable().typeError(ERROR_CODES.INVALID_TAG_NAME),
    amount: number().required().typeError(ERROR_CODES.INVALID_AMOUNT)
})

export const fetchExpensesSchema = object({
    startDate: string().required().typeError(ERROR_CODES.INVALID_START_DATE),
    endDate: string().required().typeError(ERROR_CODES.INVALID_END_DATE),
    tag: string().typeError(ERROR_CODES.INVALID_TAG)
})

export type UserType = InferType<typeof userSchema>;
export type BudgetType = InferType<typeof budgetSchema>;