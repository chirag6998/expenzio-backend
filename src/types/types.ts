import { Request } from "express";
import { UserType } from "../utilities/schema";

export type ErrorResponse = {
    status: number,
    errorMessage?: string
}

export interface ExpressRequest extends Request {
    user?: UserFromDb | null
}

export type DecodedToken = {
    id: string,
    userName: string
}

export interface UserFromDb extends UserType {
    _id: string
}

export type ExpenseFromDb = {
    _id: string,
    userId: string,
    tag: string,
    date: string
}

export type BudgetFromDb = {
    _id: string,
    amount: number,
    year: string,
    month: number,
    userId: string
}